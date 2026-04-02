import { redirect } from "next/navigation";
import { cookies } from "next/headers";


export default async function Page() {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("session_token");

  redirect(sessionToken ? "/home" : "/signin");
}
