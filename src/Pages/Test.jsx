import supabase from "../supabaseClient";

function Test() {
  async function test() {
    const { data, error } = await supabase.from("Accounts").select("*");
    if (error) console.error("Error occured", error);
    console.log(data);
  }

  return <div>test page only</div>;
}

export default Test;
