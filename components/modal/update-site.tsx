import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

export default function UpdateSiteModal({
  headerTitle,
  bodyText,
  onclickFunc,
  loadingState,
  data,
}: {
  headerTitle: string;
  bodyText: string;
  onclickFunc: () => void;
  loadingState: boolean;
  data?: any;
}) {
  const credenzaRef = useRef<any>(null);
  const handleYesClick = async () => {
    onclickFunc();
    if (credenzaRef.current) {
      credenzaRef.current.close();
    }
  };
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button disabled={loadingState || (data && !data?.length)}>
          {loadingState && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loadingState ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{headerTitle}</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>{bodyText}</CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Non</Button>
          </CredenzaClose>
          <CredenzaClose asChild>
            <Button onClick={handleYesClick}>Oui</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
