"use client";

import { Fonts, Modal, ThumbnailButton } from "@easyblocks/design-system";
import React, { useEffect, useState } from "react";
import type { Media } from "./Media";
import { MOCK_ASSETS } from "./mockAssets";
import ImageUpload from "@/components/imageUploader";
import { useParams } from "next/navigation";
import {
  deletePageImage,
  getAllFilesInFolder,
} from "@/lib/serverActions/pageActions";
import { getMediaItemsByPrefix } from "@/lib/utils";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "sonner";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";

function CardsGroup(props: {
  items: Media[];
  onSelect: (item: Media) => void;
  mediaType: "image" | "video";
  pageId: string;
  callbackFunc: Function;
}) {
  const handleDeleteSite = async (imageName: string) => {
    const { status, text }: { status: "success" | "error"; text: string } =
      await deletePageImage(
        Number(props.pageId),
        imageName,
        "Image supprimée avec succès !"
      );
    toast[status](text);
    if (status === "success" && props.callbackFunc) {
      props.callbackFunc();
    }
  };
  return (
    <div style={{ marginTop: "40px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gridColumnGap: "30px",
          gridRowGap: "30px",
        }}
      >
        {props.items.map((item) => {
          return (
            <div
              key={item.id}
              className="cursor-pointer outline-offset-8 outline-1 hover:outline hover:outline-neutral-400"
            >
              <div
                style={{
                  paddingBottom: "100%",
                  background: "#eaeaea",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {item.thumbnail !== undefined ? (
                  <div>
                    <XMarkIcon
                      className="h-5 w-5 absolute top-2 right-2 cursor-pointer text-black dark:hover:text-red-600 z-50"
                      onClick={() => {
                        handleDeleteSite(item.title);
                      }}
                    />
                    <img
                      onClick={() => {
                        props.onSelect(item);
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      src={item.thumbnail}
                    />
                  </div>
                ) : item.isVideo ? (
                  !console.log(item) && <img src={item.url} /> // <svg
                ) : //   viewBox="0 0 24 24"
                //   style={{
                //     position: "absolute",
                //     top: 0,
                //     left: 0,
                //     width: "100%",
                //     height: "100%",
                //     objectFit: "contain",
                //   }}
                // >
                //   <path
                //     fill="black"
                //     d="M8,5.14V19.14L19,12.14L8,5.14Z"
                //     width={48}
                //     height={48}
                //   />
                // </svg>
                null}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                  marginTop: "12px",
                }}
              >
                <div style={{ ...Fonts.body, wordBreak: "break-word" }}>
                  {item.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const MediaPicker: React.FC<{
  id: string | null;
  onChange: (id: string) => void;
  mediaType: "video" | "image";
}> = ({ onChange, id, mediaType }) => {
  const [isOpen, setOpen] = useState(false);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<MediaItem | undefined>();
  const [page, setPage] = useState<PagesWithSitesValues>();

  const { id: pageId } = useParams() as { id: string };
  const fetchData = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: error_page } = await supabase
        .from("pages_with_sites_values")
        .select("*")
        .eq("id", pageId)
        .single();
      setPage(data);
      setLoading(true);
      if (data?.site_id) {
        const filesInFolder = await getAllFilesInFolder(
          "images",
          data.site_id.toString()
        );
        setFiles(filesInFolder);
        setSelectedItem(
          getMediaItemsByPrefix(filesInFolder, data.site_id.toString()).find(
            (item) => item.id === id
          )
        );
        console.log(
          "OOOO",
          id,
          getMediaItemsByPrefix(filesInFolder, data.site_id.toString())
        );

        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des images :", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  let label = "Pick media";

  if (selectedItem?.isVideo) {
    label = "Video";
  } else if (selectedItem?.mimeType === "image/svg+xml") {
    label = "SVG";
  } else if (selectedItem) {
    label = "Image";
  }
  return (
    <div className="w-full">
      <ThumbnailButton
        onClick={() => {
          setOpen(true);
        }}
        label={label}
        description={selectedItem ? selectedItem.title : undefined}
        thumbnail={
          selectedItem && selectedItem.thumbnail
            ? { type: "image", src: selectedItem.thumbnail }
            : undefined
        }
      />

      <Modal
        title="Media"
        isOpen={isOpen}
        onRequestClose={() => {
          setOpen(false);
        }}
        mode={"center-huge"}
        headerLine={true}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader color={"#3498db"} loading={loading} size={30} />
          </div>
        ) : (
          <div className="flex flex-col h-max p-6">
            <div className="grid gap-4 py-4">
              <ImageUpload id={Number(pageId)} callbackFunc={fetchData} />
            </div>
            <CardsGroup
              onSelect={(item) => {
                console.log(onChange);
                onChange(item.id);
                setOpen(false);
              }}
              items={getMediaItemsByPrefix(
                files,
                page?.site_id?.toString() || ""
              ).filter((a) => a.isVideo === (mediaType === "video"))}
              // items={MOCK_ASSETS.filter(
              //   (a) => a.isVideo === (mediaType === "video")
              // )}
              mediaType={mediaType}
              pageId={pageId}
              callbackFunc={fetchData}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
