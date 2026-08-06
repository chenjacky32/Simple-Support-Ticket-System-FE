"use client"
import { useParams } from "next/navigation"

export default function UserDetailsPage() {
    const { slug } = useParams()
    return <>
        <div className="mx-auto flex font-bold">
            Details Users :{slug}
        </div>
    </>
}