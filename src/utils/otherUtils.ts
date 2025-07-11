export function generateUnorderedList(items: string[], bulletType: string): string {
    if (!Array.isArray(items) || items.length === 0) {
        return ""; // Mengembalikan daftar kosong jika tidak ada item
    }

    const listItems = items.map((item: string) => `\n${bulletType} ${item}`).join("");
    return `${listItems}`; // Menggabungkan dalam elemen <ul>
}

// Tutorial state management
export const TUTORIAL_COMPLETED_KEY = 'wisnus_tutorial_completed';

export const getTutorialCompleted = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
};

export const setTutorialCompleted = (completed: boolean): void => {
  if (typeof window === 'undefined') return;
  if (completed) {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
  } else {
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
  }
};

export const resetTutorialState = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
};
