import { Database as DB } from "@/lib/database/database.types";

declare global {
  type Database = DB;
  type Sites = DB["public"]["Tables"]["sites"]["Row"];
  type Pages = DB["public"]["Tables"]["pages"]["Row"];
  type PagesWithSitesValues =
    DB["public"]["Views"]["pages_with_sites_values"]["Row"];
  type SitesWithoutUsers = DB["public"]["Views"]["sites_without_users"]["Row"];
  type SitesWithUsers = DB["public"]["Views"]["sites_with_users"]["Row"];
  type FormSchema = z.infer<typeof formSchema>;
  interface Location {
    uniqueId: string;
    name: string;
    lat: number;
    lng: number;
  }

  interface Services {
    name: string;
  }

  type DynamicStyle =
    | {
        gradientStyle: {
          backgroundImage: string;
        };
        linkStyle: {
          color: string;
        };
        backgroundColor: {
          backgroundColor: string;
        };
      }
    | {
        gradientStyle: {
          backgroundColor: string;
        };
        linkStyle: {
          color: string;
        };
        backgroundColor: {
          backgroundColor: string;
        };
      };
}
