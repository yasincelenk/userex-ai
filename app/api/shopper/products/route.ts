import { createProduct, deleteProduct, getProducts, updateProduct } from "@/lib/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const chatbotId = searchParams.get("chatbotId");

    if (!chatbotId) {
        return new NextResponse("Missing chatbotId", { status: 400 });
    }

    try {
        const products = await getProducts(chatbotId);
        return NextResponse.json({ products });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { chatbotId, name, price, description } = body;

        if (!chatbotId || !name || price === undefined) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const productId = await createProduct(body);
        return NextResponse.json({ success: true, productId });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return new NextResponse("Missing product ID", { status: 400 });
        }

        await updateProduct(id, updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
        return new NextResponse("Missing product ID", { status: 400 });
    }

    try {
        await deleteProduct(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
