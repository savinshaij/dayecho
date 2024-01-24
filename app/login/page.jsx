
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LoginForm from "@/components/LoginForm";

export default async function Register() {
  const session = await getServerSession(authOptions);
console.log(session)
if(session){
  return redirect("/home");
}
  return(<LoginForm />) ;

 
}
