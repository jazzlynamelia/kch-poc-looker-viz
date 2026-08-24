// POC: Cek apakah Community Visualization bisa baca filter state
// yang aktif di Looker Studio (Region, Branch, Date Range, dll)
//
// Widget ini TIDAK memanggil API apapun — cuma nampilin filter yang
// terdeteksi ke layar, buat validasi dulu sebelum lanjut ke integrasi API.

function drawViz(data) {
  const container = document.getElementById('container');
  container.innerHTML = '';

  const title = document.createElement('h3');
  title.innerText = 'Filter State yang Terdeteksi:';
  container.appendChild(title);

  // 1. Cek filter yang di-apply lewat "interactions"/filter control biasa
  // Ini muncul di data.fields kalau ada dimension control terhubung
  const filterBox = document.createElement('pre');
  filterBox.style.background = '#f5f5f5';
  filterBox.style.padding = '10px';
  filterBox.style.fontSize = '12px';
  filterBox.style.overflow = 'auto';
  filterBox.style.maxHeight = '300px';

  // dscc kasih akses ke beberapa hal penting:
  // - data.filters      -> filter control yang sedang aktif di page (kalau ada)
  // - data.tables        -> data yang sudah difilter sesuai kondisi page saat ini
  // - dscc.getInteractionData() -> info interaksi user (klik, hover, dll)

  const output = {
    'Ada data.filters?': !!data.filters,
    'Isi data.filters': data.filters || '(tidak ada / API filter tidak expose langsung di sini)',
    'Jumlah baris di data.tables (menandakan filter SUDAH ke-apply ke data)':
      data.tables && data.tables.DEFAULT ? data.tables.DEFAULT.length : 'N/A',
    'Sample 1 baris data (untuk verifikasi filter benar2 mempengaruhi isi data)':
      data.tables && data.tables.DEFAULT && data.tables.DEFAULT[0]
        ? data.tables.DEFAULT[0]
        : 'Tidak ada data / field belum di-map',
  };

  filterBox.innerText = JSON.stringify(output, null, 2);
  container.appendChild(filterBox);

  const note = document.createElement('p');
  note.style.fontSize = '11px';
  note.style.color = '#666';
  note.innerHTML =
    'Catatan: Looker Studio Community Viz TIDAK expose nilai filter control ' +
    'secara langsung sebagai objek "filter". Cara paling reliable untuk tau ' +
    'filter aktif adalah lewat <b>jumlah & isi baris di data.tables</b> — ' +
    'kalau baris berubah waktu kamu ganti filter Region/Branch di dashboard, ' +
    'berarti filter BENERAN ke-apply ke data yang diterima widget ini.';
  container.appendChild(note);
}

// Subscribe ke perubahan data setiap kali filter/style di page berubah
dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
