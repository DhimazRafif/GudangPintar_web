
import { useEffect, useRef, useState } from "react";

const KUNCI = "gudangPintar_barang";

// Data awal diambil dari localStorage
function muatData() {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function rupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

function App() {
  const [barang, setBarang] = useState(muatData);
  const [pencarian, setPencarian] = useState("");
  const [pesan, setPesan] = useState("");
  const [idEdit, setIdEdit] = useState(null);

  const modalRef = useRef(null);

  const [form, setForm] = useState({
    nama: "",
    harga: "",
    stok: "",
    tanggal: ""
  });

  // Menyimpan data setiap kali daftar barang berubah
  useEffect(() => {
    try {
      localStorage.setItem(KUNCI, JSON.stringify(barang));
    } catch (error) {
      console.error(error);
      setPesan("Data gagal disimpan di browser.");
    }
  }, [barang]);

  // Membuka form tambah barang
  function bukaTambah() {
    setIdEdit(null);

    setForm({
      nama: "",
      harga: "",
      stok: "",
      tanggal: ""
    });

    modalRef.current?.showModal();
  }

  // Membuka form edit barang
  function bukaEdit(item) {
    setIdEdit(item.id);

    setForm({
      nama: item.nama,
      harga: String(item.harga),
      stok: String(item.stok),
      tanggal: item.tanggal || ""
    });

    modalRef.current?.showModal();
  }

  // Mengubah isi input form
  function handleInput(event) {
    const { name, value } = event.target;

    setForm((sebelumnya) => ({
      ...sebelumnya,
      [name]: value
    }));
  }

  // Menyimpan barang baru atau perubahan barang
  function simpanBarang(event) {
    event.preventDefault();

    const nama = form.nama.trim();
    const harga = Number(form.harga);
    const stok = Number(form.stok);

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
      tanggal: form.tanggal
    };

    if (idEdit !== null) {
      setBarang((sebelumnya) =>
        sebelumnya.map((item) =>
          item.id === idEdit
            ? { ...item, ...dataBaru }
            : item
        )
      );

      setPesan("Perubahan barang berhasil disimpan.");
    } else {
      setBarang((sebelumnya) => [
        ...sebelumnya,
        {
          id: String(Date.now()) +
            Math.random().toString(16).slice(2),
          ...dataBaru
        }
      ]);

      setPesan("Barang baru berhasil ditambahkan.");
    }

    modalRef.current?.close();
  }

  // Menghapus barang
  function hapusBarang(id) {
    const item = barang.find((b) => b.id === id);

    if (!item) return;

    if (!confirm(`Yakin ingin menghapus ${item.nama}?`)) {
      return;
    }

    setBarang((sebelumnya) =>
      sebelumnya.filter((b) => b.id !== id)
    );

    setPesan(`Barang ${item.nama} berhasil dihapus.`);
  }

  // Menambah atau mengurangi stok
  function ubahStok(id, perubahan) {
    const item = barang.find((b) => b.id === id);

    if (!item) return;

    if (item.stok + perubahan < 0) {
      setPesan("Stok tidak bisa kurang dari nol.");
      return;
    }

    setBarang((sebelumnya) =>
      sebelumnya.map((b) =>
        b.id === id
          ? { ...b, stok: b.stok + perubahan }
          : b
      )
    );

    setPesan(
      `Stok ${item.nama} sekarang ${item.stok + perubahan}.`
    );
  }

  // Menampilkan hasil pencarian
  const hasil = barang.filter((item) =>
    item.nama.toLowerCase().includes(
      pencarian.trim().toLowerCase()
    )
  );

  return (
    <>
      <header className="topbar">
        <h2 className="brand">Gudang Pintar</h2>

        <input
          type="search"
          id="cariBarang"
          placeholder="Cari barang..."
          value={pencarian}
          onChange={(event) =>
            setPencarian(event.target.value)
          }
        />

        <button
          type="button"
          className="btn utama"
          id="tombolTambah"
          onClick={bukaTambah}
        >
          + Tambah Barang
        </button>
      </header>

      <div className="container">
        <aside>
          <a href="#">Dashboard</a>
          <a href="#" className="aktif">Barang</a>
          <a href="#">Riwayat</a>
          <a href="#">Akun</a>
        </aside>

        <main>
          <h1>Barang</h1>

          <p>Kelola barang, harga, dan stok gudang.</p>

          <p id="jumlahBarang">
            Jumlah barang: {barang.length}
          </p>

          <p id="pesanBarang">{pesan}</p>

          <div className="tabel-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Kedaluwarsa</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody id="daftarBarang">
                {hasil.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Nama Barang">
                      {item.nama}
                    </td>

                    <td data-label="Harga">
                      {rupiah(item.harga)}
                    </td>

                    <td data-label="Stok">
                      <div className="stok-control">
                        <button
                          type="button"
                          title="Kurangi stok"
                          onClick={() => ubahStok(item.id, -1)}
                        >
                          −
                        </button>

                        <b>{item.stok}</b>

                        <button
                          type="button"
                          title="Tambah stok"
                          onClick={() => ubahStok(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td data-label="Kedaluwarsa">
                      {item.tanggal || "—"}
                    </td>

                    <td data-label="Status">
                      <span
                        className={
                          "status " +
                          (item.stok === 0
                            ? "habis"
                            : item.stok <= 10
                              ? "rendah"
                              : "aman")
                        }
                      >
                        {item.stok === 0
                          ? "Stok habis"
                          : item.stok <= 10
                            ? "Stok rendah"
                            : "Stok aman"}
                      </span>
                    </td>

                    <td data-label="Aksi">
                      <div className="aksi">
                        <button
                          type="button"
                          className="btn btn-edit"
                          onClick={() => bukaEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-hapus"
                          onClick={() => hapusBarang(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {hasil.length === 0 && (
              <p id="kosong">
                {barang.length === 0
                  ? "Belum ada barang. Silakan tambah barang."
                  : "Barang tidak ditemukan."}
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Form tambah dan edit barang */}
      <dialog id="modalBarang" ref={modalRef}>
        <form onSubmit={simpanBarang}>
          <h2>
            {idEdit !== null ? "Edit Barang" : "Tambah Barang"}
          </h2>

          <label htmlFor="namaBarang">Nama Barang</label>
          <input
            id="namaBarang"
            name="nama"
            type="text"
            value={form.nama}
            onChange={handleInput}
            required
          />

          <label htmlFor="hargaBarang">Harga</label>
          <input
            id="hargaBarang"
            name="harga"
            type="number"
            min="0"
            value={form.harga}
            onChange={handleInput}
            required
          />

          <label htmlFor="stokBarang">Stok</label>
          <input
            id="stokBarang"
            name="stok"
            type="number"
            min="0"
            step="1"
            value={form.stok}
            onChange={handleInput}
            required
          />

          <label htmlFor="tanggalBarang">
            Tanggal Kedaluwarsa
          </label>
          <input
            id="tanggalBarang"
            name="tanggal"
            type="date"
            value={form.tanggal}
            onChange={handleInput}
          />

          <div className="tombol-form">
            <button type="submit" className="btn utama">
              Simpan
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => modalRef.current?.close()}
            >
              Batal
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default App;
