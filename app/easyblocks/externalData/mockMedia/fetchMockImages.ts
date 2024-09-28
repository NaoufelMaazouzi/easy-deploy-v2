import { RequestedExternalData, ExternalData } from "@easyblocks/core";
import { MOCK_ASSETS } from "./mockAssets";
import { getAllFilesInFolder } from "@/lib/serverActions/pageActions";
import { getMediaItemsByPrefix } from "@/lib/utils";

export async function fetchMockImages(
  externalData: RequestedExternalData
): Promise<ExternalData> {
  const allResources = Object.entries(externalData).filter(
    ([, resource]) => resource.widgetId === "mockImage"
  );

  if (allResources.length === 0) {
    return {};
  }

  const results: Record<string, any> = {};
  const filesInFolder = await getAllFilesInFolder("images", "220");

  allResources.forEach(([fieldId, { id }]) => {
    // const asset = MOCK_ASSETS.find((asset) => asset.id === id);
    const asset = getMediaItemsByPrefix(filesInFolder, "220").find(
      (asset) => asset.id === id
    );

    if (!asset) {
      results[fieldId] = {
        error: new Error("error while fetching asset"),
      };
      return;
    }

    let aspectRatio = 1;
    let width = 500;
    let height = 500;
    if (asset.width !== undefined && asset.height !== undefined) {
      aspectRatio = asset.width / asset.height;
      width = asset.width;
      height = asset.height;
    }

    results[fieldId] = {
      type: "@easyblocks/image",
      value: {
        url: asset.url,
        alt: asset.title,
        aspectRatio,
        mimeType: asset.mimeType,
        srcset: [
          {
            w: width,
            h: height,
            url: asset.url,
          },
        ],
      },
    };
  });

  return results;
}
