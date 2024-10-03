import type { Metadata } from "next"
import NewsInner from "./NewsInner"

export const metadata: Metadata = {
    title: "Healthbar | News",
}

const News = () => {
    return <NewsInner />
}

export default News