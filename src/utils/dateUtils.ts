// src/utils/dateUtils.ts

/**
 * Format tanggal ke format Indonesia (DD/MM/YYYY)
 */
export function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
  
  /**
   * Format tanggal ke format Indonesia dengan waktu (DD/MM/YYYY HH:MM)
   */
  export function formatDateWithTime(date: Date): string {
    const formattedDate = formatDate(date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${formattedDate} ${hours}:${minutes}`;
  }
  
  /**
   * Format tanggal ke format Indonesia dengan nama bulan (DD Bulan YYYY)
   */
  export function formatDateWithMonthName(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    return `${day} ${monthNames[monthIndex]} ${year}`;
  }
  
  /**
   * Menghitung durasi antara dua tanggal dalam format menit
   */
  export function calculateDurationInMinutes(startDate: Date, endDate: Date): number {
    const durationMs = endDate.getTime() - startDate.getTime();
    return Math.round(durationMs / (1000 * 60)); // Konversi ms ke menit
  }
  
  /**
   * Format durasi dalam menit ke string yang lebih mudah dibaca
   */
  export function formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} menit`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} jam`;
    }
    
    return `${hours} jam ${remainingMinutes} menit`;
  }