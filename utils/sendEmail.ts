export async function sendEmail(subject: string, text: string) {
    const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, text }),
    });

    if (!response.ok) {
        throw new Error("Failed to send email");
    }

    return await response.json();
}
