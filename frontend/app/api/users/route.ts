// app/api/users/route.ts

export async function GET() {
  const response = await fetch(
    "https://691af0292d8d78557570c8c6.mockapi.io/api/all/users",
    { headers: { "Content-Type": "application/json" } }
  );

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://691af0292d8d78557570c8c6.mockapi.io/api/all/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to create user" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(
      `https://691af0292d8d78557570c8c6.mockapi.io/api/all/users/${params.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to delete user" }),
        { status: response.status }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
