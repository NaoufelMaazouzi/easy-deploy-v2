import { Database as DB } from "@/lib/database/database.types";

declare global {
  type Database = DB;
  type Sites = DB["public"]["Tables"]["sites"]["Row"];
}
