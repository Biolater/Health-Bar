import { Metadata } from "next";
import SignUpForm from "./SignupForm";
import Link from "next/link";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { FlipWords } from "@/components/ui/flip-words";
import Logo from "@/assets/logo.svg";
import RightSignUp from "./RightSignUp"
import Image from "next/image";
export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUp = () => {
  return (
    <main className="lg:flex">
      <BackgroundGradientAnimation>
        <Link href="/" className="absolute top-6 left-6 z-10">
          <Image src={Logo} alt="logo" width={50} height={50} />
        </Link>
        <div className="w-full h-svh flex items-center justify-center inset-0 absolute">
          <div className="p-2 max-w-[300px] mx-auto rounded-lg text-white text-3xl">
            Be
            <FlipWords words={["Healthy", "Strong"]} duration={3000} />
            with Health Bar
          </div>
        </div>
      </BackgroundGradientAnimation>
      <RightSignUp />
    </main>
  );
};

export default SignUp;
