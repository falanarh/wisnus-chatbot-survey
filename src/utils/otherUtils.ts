export function generateUnorderedList(items: string[], bulletType: string): string {
    if (!Array.isArray(items) || items.length === 0) {
        return ""; // Mengembalikan daftar kosong jika tidak ada item
    }

    const listItems = items.map((item: string) => `\n${bulletType} ${item}`).join("");
    return `${listItems}`; // Menggabungkan dalam elemen <ul>
}
