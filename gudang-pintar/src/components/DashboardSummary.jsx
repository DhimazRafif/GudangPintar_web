import React from "react";

export default function DashboardSummary({ items }) {
  if (!items || items.length === 0) return null;

  const totalMakananMinuman = items.filter(
    (item) => item.categoryid === 2,
  ).length;
  const totalNonMakanan = items.filter((item) => item.categoryid === 1).length;

  const warningItems = items.filter(
    (item) => item.quantity <= item.notification_threshold,
  );
  warningItems.sort((a, b) => a.quantity - b.quantity);

  return (
    <div className="row mb-4">
      <div className="col-12 col-md-3 col-sm-6 mb-3">
        <div className="card h-100 summary-card text-center">
          <div className="card-body d-flex flex-column justify-content-center">
            <div className="icon-circle mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-cup-hot-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6zM13 12.5a2 2 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5"
                />
                <path d="m4.4.8-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 3.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 6.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8m3 0-.003.004-.014.019a4 4 0 0 0-.204.31 2 2 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.6.6 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3 3 0 0 1-.202.388 5 5 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4 4 0 0 0 .204-.31 2 2 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.6.6 0 0 0-.09-.252A4 4 0 0 0 9.6 2.8l-.01-.012a5 5 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a6 6 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8" />
              </svg>
            </div>
            <h3 className="fw-bold m-0">{totalMakananMinuman}</h3>
            <small className="text-muted mt-1">Makanan & Minuman</small>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-3 col-sm-6 mb-3">
        <div className="card h-100 summary-card text-center">
          <div className="card-body d-flex flex-column justify-content-center">
            <div className="icon-circle mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-paperclip"
                viewBox="0 0 16 16"
              >
                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
              </svg>
            </div>
            <h3 className="fw-bold m-0">{totalNonMakanan}</h3>
            <small className="text-muted mt-1">Kebutuhan & ATK</small>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 mb-3">
        <div className="card h-100 summary-card">
          <div className="card-body d-flex flex-column">
            <h6 className="fw-bold text-dark mb-3">Peringatan Stok</h6>

            <div
              className="warning-list flex-grow-1 overflow-auto"
              style={{ maxHeight: "110px" }}
            >
              {warningItems.length > 0 ? (
                warningItems.map((item) => (
                  <div
                    key={item.barangid}
                    className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"
                  >
                    <div>
                      <span
                        className="fw-bold d-block"
                        style={{ fontSize: "0.95 rem" }}
                      >
                        {item.name}
                      </span>
                      <small
                        className={
                          item.quantity === 0
                            ? "text-danger fw-bold"
                            : "text-warning fw-bold"
                        }
                      >
                        {item.quantity === 0 ? "Stok Habis" : "Stok Menipis"}
                      </small>
                    </div>
                    <span className="fw-bold">Sisa : {item.quantity}</span>
                  </div>
                ))
              ) : (
                <p className="text-success text-center mt-4">
                  Semua stok barang dalam kondisi aman.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
