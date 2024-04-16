import Image from "next/image";
import PreviewImg from "../../../public/preview.png";
import { pricingCards } from "@/lib/constants";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import clsx from "clsx";
import { Star } from "lucide-react";
import Link from "next/link";
import GradientText from "@/components/golbal/GradientText";
// exporting site
export default function Home() {
  return (
    <main>
      <section className=" h-screen w-full pt-36 relative flex items-center justify-center flex-col ">
        <div className="relative h-full w-full  flex items-center justify-center">
          <div className="absolute opacity-[0.5] h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="bg-gradient-to-r from-red-700 to-blue-600 text-transparent bg-clip-text relative">
            <h1 className="text-9xl font-mono font-bold md:text-[300px] text-center">
              Grow
            </h1>
            <p className="text-center  text-[2rem]  ">
              Run Your Agency With Us.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full md:pt-34 relative flex items-center justify-center flex-col ">
        <div className="flex w-full justify-center items-center relative">
          <Image
            src={PreviewImg}
            alt="Preview"
            width={700}
            height={700}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted w-full opacity-[1]"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section className="flex justify-center flex-col gap-4 mt-20">
        <h2 className="text-4xl text-center">Subscriptions Made Simple</h2>
        <p className="text-muted-foreground text-center">
          Subscriptions Made Simple: Simplify Your Life with Easy Sign-Up and
          Effortless Enjoyment!
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((c) => (
            <Card
              key={c.title}
              className={clsx(
                "w-[300px] flex flex-col justify-between border-[1px] ",
                {
                  "border-2 border-x-red-500": c.title === "Unlimited Saas",
                }
              )}
            >
              <CardHeader>
                <CardTitle className={"text-gradient"}>
                  <GradientText text={c.title} from="red" to="blue" />
                </CardTitle>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bol">{c.price}</span>
                {c.title !== "Starter" && <span>/m</span>}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {c.features.map((f) => (
                    <p
                      key={f}
                      className="flex gap-2 items-center text-muted-foreground"
                    >
                      <Star size={10} />
                      {f}
                    </p>
                  ))}
                </div>
                <Link
                  href={`/agency/?plan=${c.priceId}`}
                  className={clsx(
                    "w-full text-primary bg-gradient-to-l from-red-500   p-2 rounded-md text-white text-center",
                    {
                      "!bg-muted-foreground": c.title === "Unlimited Saas",
                    }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
