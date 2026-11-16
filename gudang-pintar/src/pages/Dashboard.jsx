import React, { useState, useEffect } from "react";
import ItemCard from "../components/dashboard/ItemCard";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import "./Dashboard.css";
import useFetch from "../hooks/useFetch";
import MainLayout from "../app-layouts/MainLayout";
import Pagination from "../components/common/Pagination";
import FilterGroup from "../components/common/FilterGroup";
import Button from "../components/common/Button";
import useNotification from "../hooks/useNotification";

export default function Dashboard() {
  const { notify } = useNotification();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStock, setSelectedStock] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const { data: items, isLoading, error, refetch } = useFetch("/barang.json");

  useEffect(() => {
    if (error) {
      notify({ type: "danger", title: "Gagal memuat barang", message: error });
    }
  }, [error, notify]);

  const currentItems = items || [];
  const activeItems = currentItems.filter((item) => item.isActive === 1);
  const checkCategory = (item) =>
    selectedCategory === "all" || item.categoryid === selectedCategory;

  const checkStockStatus = (item) => {
    if (selectedStock === "all") return true;
    if (selectedStock === "habis") return item.quantity === 0;
    if (selectedStock === "menipis") {
      return item.quantity > 0 && item.quantity <= item.notification_threshold;
    }
    if (selectedStock === "aman") {
      return item.quantity > item.notification_threshold;
    }
    return true;
  };

  const itemsForCategoryCount = activeItems.filter(checkStockStatus);
  const categoryOptions = [
    {
      value: "all",
      label: "Semua Kategori",
      count: itemsForCategoryCount.length,
      tooltip: "Tampilkan seluruh kategori barang",
    },
    {
      value: 2,
      label: "Makanan & Minuman",
      count: itemsForCategoryCount.filter((item) => item.categoryid === 2)
        .length,
      tooltip: "Tampilkan hanya kategori Makanan & Minuman",
    },
    {
      value: 1,
      label: "Kebutuhan & ATK",
      count: itemsForCategoryCount.filter((item) => item.categoryid === 1)
        .length,
      tooltip: "Tampilkan hanya kategori Kebutuhan & ATK",
    },
  ];

  const itemsForStockCount = activeItems.filter(checkCategory);
  const stockOptions = [
    {
      value: "all",
      label: "Semua Status",
      count: itemsForStockCount.length,
      tooltip: "Tampilkan seluruh status ketersediaan stok",
    },
    {
      value: "aman",
      label: "Stok Aman",
      count: itemsForStockCount.filter(
        (item) => item.quantity > item.notification_threshold,
      ).length,
    },
    {
      value: "menipis",
      label: "Stok Menipis",
      count: itemsForStockCount.filter(
        (item) =>
          item.quantity > 0 && item.quantity <= item.notification_threshold,
      ).length,
    },
    {
      value: "habis",
      label: "Stok Habis",
      count: itemsForStockCount.filter((item) => item.quantity === 0).length,
    },
  ];

  const filteredItems = activeItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return checkCategory(item) && checkStockStatus(item) && matchesSearch;
  });

  const warningItemsCount = activeItems.filter(
    (item) => item.quantity <= item.notification_threshold,
  ).length;

  useEffect(() => {
    if (!isLoading && !error && warningItemsCount > 0) {
      notify({
        type: "warning",
        title: "Peringatan stok",
        message: `Ada ${warningItemsCount} barang yang stoknya menipis atau habis. Segera lakukan pengecekan.`,
      });
    }
  }, [isLoading, error, warningItemsCount, notify]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStock]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const displayedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const isFilterActive =
    searchQuery !== "" || selectedCategory !== "all" || selectedStock !== "all";

  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStock("all");
  };
  return (
    <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <h1 className="dashboard-title">Daftar Barang</h1>
      <p className="dashboard-description">
        Pantau jumlah dan status stok barang di gudang.
      </p>

      {error && (
        <div className="alert alert-danger text-center shadow-sm" role="alert">
          <p className="mb-2">{error}</p>
          <Button
            variant="danger"
            size="sm"
            onClick={refetch}
            title="Muat ulang data"
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {isLoading && !error && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-secondary">Memuat data barang...</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <DashboardSummary items={activeItems} />
          <div
            className="bg-white p-3 rounded-3 border mb-3 shadow-sm d-flex flex-column flex-md-row align-items-stretch align-items-md-end justify-content-between gap-3"
            role="region"
            aria-label="Filter Group Daftar Barang"
          >
            <div className="d-flex flex-column flex-sm-row gap-3 flex-grow-1">
              <FilterGroup
                id="filter-kategori"
                label="Kategori Barang"
                options={categoryOptions}
                selectedValue={selectedCategory}
                onChange={setSelectedCategory}
              />

              <FilterGroup
                id="filter-status-stok"
                label="Status Stok"
                options={stockOptions}
                selectedValue={selectedStock}
                onChange={setSelectedStock}
              />
            </div>

            {isFilterActive && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetFilter}
                title="Kembalikan semua filter ke pengaturan awal"
              >
                Reset Filter
              </Button>
            )}
          </div>

          <div className="item-list">
            {displayedItems.map((item) => (
              <ItemCard key={item.barangid} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-4 bg-white rounded-3 border mt-2">
              <p className="text-secondary mb-2">Barang tidak ditemukan.</p>
              {isFilterActive && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResetFilter}
                >
                  Reset Semua Filter
                </Button>
              )}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            ariaLabel="Navigasi Halaman Dashboard"
          />
        </>
      )}
    </MainLayout>
  );
}
