import { Database as DB } from "@/lib/database/database.types";

declare global {
  type Database = DB;
  type Sites = DB["public"]["Tables"]["sites"]["Row"];
  type Pages = DB["public"]["Tables"]["pages"]["Row"];
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
}
