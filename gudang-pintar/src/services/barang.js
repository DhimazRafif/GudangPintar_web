
const KUNCI = "gudangPintar_barang";

const $ = (id) => document.getElementById(id);

const daftar = $("daftarBarang");
const modal = $("modalBarang");
const form = $("formBarang");

let barang = muatData();

// =====================================
// 1. MEMUAT DATA
// =====================================

function muatData() {
    try {
        const data = JSON.parse(localStorage.getItem(KUNCI));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

// =====================================
// 2. MENYIMPAN DATA
// =====================================

function simpanData() {
    try {
        localStorage.setItem(KUNCI, JSON.stringify(barang));
        return true;
    } catch (error) {
        alert("Data gagal disimpan di browser.");
        console.error(error);
        return false;
    }
}

// =====================================
// 3. FORMAT RUPIAH
// =====================================

function rupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(nilai);
}

// =====================================
// 4. MENAMPILKAN PESAN
// =====================================

function tampilkanPesan(teks) {
    $("pesanBarang").textContent = teks;
}

// =====================================
// 5. TAMBAH BARANG
// =====================================

function bukaTambah() {
    form.reset();

    $("barangId").value = "";
    $("judulModal").textContent = "Tambah Barang";

    modal.showModal();
}

// =====================================
// 6. EDIT BARANG
// =====================================

function bukaEdit(id) {
    const b = barang.find(x => x.id === id);

    if (!b) return;

    $("barangId").value = b.id;
    $("namaBarang").value = b.nama;
    $("hargaBarang").value = b.harga;
    $("stokBarang").value = b.stok;
    $("tanggalBarang").value = b.tanggal || "";

    $("judulModal").textContent = "Edit Barang";

    modal.showModal();
}

// =====================================
// 7. SIMPAN FORM
// =====================================

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = $("barangId").value;
    const nama = $("namaBarang").value.trim();
    const harga = Number($("hargaBarang").value);
    const stok = Number($("stokBarang").value);
    const tanggal = $("tanggalBarang").value;

    if (
        !nama ||
        harga < 0 ||
        !Number.isFinite(harga) ||
        !Number.isInteger(stok) ||
        stok < 0
    ) {
        alert("Periksa kembali nama, harga, dan stok barang.");
        return;
    }

    const dataBaru = {
        nama,
        harga,
        stok,
        tanggal
    };

    if (id) {
        const index = barang.findIndex(x => x.id === id);

        if (index === -1) {
            alert("Barang tidak ditemukan.");
            return;
        }

        barang[index] = {
            ...barang[index],
            ...dataBaru
        };

        tampilkanPesan("Perubahan barang berhasil disimpan.");

    } else {
        barang.push({
            id: String(Date.now()) +
                Math.random().toString(16).slice(2),
            ...dataBaru
        });

        tampilkanPesan("Barang baru berhasil ditambahkan.");
    }

    if (!simpanData()) return;

    renderBarang();
    modal.close();
});

// =====================================
// 8. MENGUBAH STOK
// =====================================

function ubahStok(id, perubahan) {
    const b = barang.find(x => x.id === id);

    if (!b) return;

    if (b.stok + perubahan < 0) {
        tampilkanPesan("Stok tidak bisa kurang dari nol.");
        return;
    }

    b.stok += perubahan;

    if (!simpanData()) {
        b.stok -= perubahan;
        return;
    }

    renderBarang();

    tampilkanPesan(
        `Stok ${b.nama} sekarang ${b.stok}.`
    );
}

// =====================================
// 9. HAPUS BARANG
// =====================================

function hapusBarang(id) {
    const b = barang.find(x => x.id === id);

    if (!b) return;

    if (!confirm(`Yakin ingin menghapus ${b.nama}?`)) {
        return;
    }

    const lama = barang;

    barang = barang.filter(x => x.id !== id);

    if (!simpanData()) {
        barang = lama;
        return;
    }

    renderBarang();

    tampilkanPesan(
        `Barang ${b.nama} berhasil dihapus.`
    );
}

// =====================================
// 10. MENAMPILKAN TABEL BARANG
// =====================================

function renderBarang() {
    daftar.replaceChildren();

    const kata = $("cariBarang").value
        .trim()
        .toLowerCase();

    const hasil = barang.filter(b =>
        b.nama.toLowerCase().includes(kata)
    );

    // Pesan ketika barang tidak ditemukan
    $("kosong").hidden = hasil.length > 0;

    if (barang.length === 0) {
        $("kosong").hidden = false;
    }

    // Memperbarui jumlah barang jika elemennya tersedia
    const jumlahBarang = $("jumlahBarang");

    if (jumlahBarang) {
        jumlahBarang.textContent =
            `Jumlah barang: ${barang.length}`;
    }

    // Membuat setiap baris barang
    hasil.forEach(b => {

        const tr = document.createElement("tr");

        // Fungsi membuat sel dengan label mobile
        function selIsi(teks, label) {
            const td = document.createElement("td");

            td.textContent = teks;
            td.dataset.label = label;

            return td;
        }

        // NAMA BARANG
        tr.appendChild(
            selIsi(b.nama, "Nama Barang")
        );

        // HARGA
        tr.appendChild(
            selIsi(rupiah(b.harga), "Harga")
        );

        // STOK
        const tdStok = document.createElement("td");

        tdStok.dataset.label = "Stok";

        const kontrol = document.createElement("div");
        kontrol.className = "stok-control";

        const kurang = document.createElement("button");
        kurang.type = "button";
        kurang.textContent = "−";
        kurang.title = "Kurangi stok";

        kurang.addEventListener("click", () => {
            ubahStok(b.id, -1);
        });

        const angka = document.createElement("b");
        angka.textContent = b.stok;

        const tambah = document.createElement("button");
        tambah.type = "button";
        tambah.textContent = "+";
        tambah.title = "Tambah stok";

        tambah.addEventListener("click", () => {
            ubahStok(b.id, 1);
        });

        kontrol.append(kurang, angka, tambah);

        tdStok.appendChild(kontrol);
        tr.appendChild(tdStok);

        // TANGGAL KEDALUWARSA
        tr.appendChild(
            selIsi(b.tanggal || "—", "Kedaluwarsa")
        );

        // STATUS
        const tdStatus = document.createElement("td");

        tdStatus.dataset.label = "Status";

        const badge = document.createElement("span");

        badge.className = "status " +
            (
                b.stok === 0
                    ? "habis"
                    : b.stok <= 10
                        ? "rendah"
                        : "aman"
            );

        badge.textContent =
            b.stok === 0
                ? "Stok habis"
                : b.stok <= 10
                    ? "Stok rendah"
                    : "Stok aman";

        tdStatus.appendChild(badge);
        tr.appendChild(tdStatus);

        // AKSI EDIT DAN HAPUS
        const tdAksi = document.createElement("td");

        tdAksi.dataset.label = "Aksi";

        const aksi = document.createElement("div");
        aksi.className = "aksi";

        // TOMBOL EDIT
        const edit = document.createElement("button");

        edit.type = "button";
        edit.className = "btn btn-edit";
        edit.textContent = "Edit";

        edit.addEventListener("click", () => {
            bukaEdit(b.id);
        });

        // TOMBOL HAPUS
        const hapus = document.createElement("button");

        hapus.type = "button";
        hapus.className = "btn btn-hapus";
        hapus.textContent = "Hapus";

        hapus.addEventListener("click", () => {
            hapusBarang(b.id);
        });

        aksi.append(edit, hapus);

        tdAksi.appendChild(aksi);
        tr.appendChild(tdAksi);

        // Memasukkan baris ke tabel
        daftar.appendChild(tr);
    });
}

// =====================================
// 11. EVENT LISTENER
// =====================================

$("tombolTambah").addEventListener("click", bukaTambah);

$("batalModal").addEventListener("click", () => {
    modal.close();
});

$("cariBarang").addEventListener("input", renderBarang);

// =====================================
// 12. MENJALANKAN TABEL
// =====================================

renderBarang();

