
const KUNCI = "gudangPintar_barang";

const $ = (id) => document.getElementById(id);

const daftar = $("daftarBarang");
const modal = $("modalBarang");
const form = $("formBarang");

let barang = muatData();

function muatData() {
    try {
        const data = JSON.parse(localStorage.getItem(KUNCI));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

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

function rupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(nilai);
}

function tampilkanPesan(teks) {
    $("pesanBarang").textContent = teks;
}

function bukaTambah() {
    form.reset();
    $("barangId").value = "";
    $("judulModal").textContent = "Tambah Barang";
    modal.showModal();
}

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

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = $("barangId").value;
    const nama = $("namaBarang").value.trim();
    const harga = Number($("hargaBarang").value);
    const stok = Number($("stokBarang").value);
    const tanggal = $("tanggalBarang").value;

    if (!nama || harga < 0 || !Number.isFinite(harga) ||
        !Number.isInteger(stok) || stok < 0) {
        alert("Periksa kembali nama, harga, dan stok barang.");
        return;
    }

    const dataBaru = { nama, harga, stok, tanggal };

    if (id) {
        const index = barang.findIndex(x => x.id === id);
        if (index === -1) {
            alert("Barang tidak ditemukan.");
            return;
        }

        barang[index] = { ...barang[index], ...dataBaru };
        tampilkanPesan("Perubahan barang berhasil disimpan.");
    } else {
        barang.push({
            id: String(Date.now()) + Math.random().toString(16).slice(2),
            ...dataBaru
        });
        tampilkanPesan("Barang baru berhasil ditambahkan.");
    }

    if (!simpanData()) return;

    renderBarang();
    modal.close();
});

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
    tampilkanPesan(`Stok ${b.nama} sekarang ${b.stok}.`);
}

function hapusBarang(id) {
    const b = barang.find(x => x.id === id);
    if (!b) return;

    if (!confirm(`Yakin ingin menghapus ${b.nama}?`)) return;

    const lama = barang;
    barang = barang.filter(x => x.id !== id);

    if (!simpanData()) {
        barang = lama;
        return;
    }

    renderBarang();
    tampilkanPesan(`Barang ${b.nama} berhasil dihapus.`);
}

function renderBarang() {
    daftar.replaceChildren();

    const kata = $("cariBarang").value.trim().toLowerCase();
    const hasil = barang.filter(b => b.nama.toLowerCase().includes(kata));

    $("kosong").hidden = hasil.length > 0;
    $("jumlahBarang")?.remove();

    if (barang.length === 0) {
        $("kosong").hidden = false;
    }

    hasil.forEach(b => {
        const tr = document.createElement("tr");

        function selIsi(teks) {
            const td = document.createElement("td");
            td.textContent = teks;
            return td;
        }

        tr.appendChild(selIsi(b.nama));
        tr.appendChild(selIsi(rupiah(b.harga)));

        const tdStok = document.createElement("td");
        const kontrol = document.createElement("div");
        kontrol.className = "stok-control";

        const kurang = document.createElement("button");
        kurang.type = "button";
        kurang.textContent = "−";
        kurang.title = "Kurangi stok";
        kurang.addEventListener("click", () => ubahStok(b.id, -1));

        const angka = document.createElement("b");
        angka.textContent = b.stok;

        const tambah = document.createElement("button");
        tambah.type = "button";
        tambah.textContent = "+";
        tambah.title = "Tambah stok";
        tambah.addEventListener("click", () => ubahStok(b.id, 1));

        kontrol.append(kurang, angka, tambah);
        tdStok.appendChild(kontrol);
        tr.appendChild(tdStok);

        tr.appendChild(selIsi(b.tanggal || "—"));

        const tdStatus = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = "status " +
            (b.stok === 0 ? "habis" : b.stok <= 10 ? "rendah" : "aman");
        badge.textContent =
            b.stok === 0 ? "Stok habis" :
            b.stok <= 10 ? "Stok rendah" : "Stok aman";
        tdStatus.appendChild(badge);
        tr.appendChild(tdStatus);

        const tdAksi = document.createElement("td");
        const aksi = document.createElement("div");
        aksi.className = "aksi";

        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "btn btn-edit";
        edit.textContent = "Edit";
        edit.addEventListener("click", () => bukaEdit(b.id));

        const hapus = document.createElement("button");
        hapus.type = "button";
        hapus.className = "btn btn-hapus";
        hapus.textContent = "Hapus";
        hapus.addEventListener("click", () => hapusBarang(b.id));

        aksi.append(edit, hapus);
        tdAksi.appendChild(aksi);
        tr.appendChild(tdAksi);

        daftar.appendChild(tr);
    });
}

$("tombolTambah").addEventListener("click", bukaTambah);
$("batalModal").addEventListener("click", () => modal.close());
$("cariBarang").addEventListener("input", renderBarang);

renderBarang();
