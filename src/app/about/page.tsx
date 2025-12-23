import AboutClient from "@/components/AboutClient";

// Metadata for SEO (Only possible in Server Components)
export const metadata = {
  title: "About Flip Finder | AI Thrift Companion",
  description: "Learn how Flip Finder uses AI to help you identify and value thrift store finds.",
};

export default function AboutPage() {
  // Logic: In the future, you can fetch dynamic data here 
  // and pass it to the client component as props.
  return <AboutClient />;
}