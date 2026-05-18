import { prisma } from "@/framework/lib/prisma"
import { NextResponse } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params
    const imageId = Number(id)

    if (isNaN(imageId)) {
      return getFallbackImage()
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    })

    if (!image || !image.src) {
      return getFallbackImage()
    }

    const buffer = Buffer.from(image.src)

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
      },
    })
  } catch (err) {
    console.error(err)
    return getFallbackImage()
  }
}

function getFallbackImage() {
  try {
    const fs = require("fs")
    const path = require("path")

    const fallbackPath = path.join(
      process.cwd(),
      "public",
      "take-the-kids",
      "not-available.png"
    )

    const fallbackBuffer = fs.readFileSync(fallbackPath)
    const uint8Array = new Uint8Array(fallbackBuffer)

    return new Response(uint8Array, {
      headers: {
        "Content-Type": "image/png",
      },
    })
  } catch (err) {
    console.error("Failed to load fallback image:", err)
    return NextResponse.json({ error: "Image not found" }, { status: 404 })
  }
}