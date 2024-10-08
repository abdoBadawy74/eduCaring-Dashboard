import axios from "axios";
import  { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE, CONTACT_US } from "../API/Api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import PropTypes from "prop-types";

export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageRecivier, setMessageRecivier] = useState("");
  const [contactMessages, setContactMessages] = useState([]);
  const { t } = useTranslation();
  // Get all support messages
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${CONTACT_US}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
      })
      .then((data) => {
        setContactMessages(data.data.responseObject);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="h-100">
      <h2 className="main-title fw-bold text-muted">
        {t("ContactMessages")} {"  "}
        <small className="text-muted mt-3 fw-light fst-italic ">
          {t("AllContactMessages")}
        </small>
      </h2>
      <div style={{ overflowX: "auto" }}>
        <DataTable
          dataKey="id"
          rowClassName={() => " support-row"}
          value={contactMessages}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          paginatorClassName="justify-content-center align-items-center pagination rounded"
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          rows={10}
          filterDisplay="row"
          emptyMessage={t("NoUsersFound")}
          onRowClick={(event) => {
            setModalVisible(true);
            setMessageRecivier(event.data);
          }}
        >
          <Column
            body={(rowData, index) => index.rowIndex + 1}
            header={t("Count")}
          ></Column>

          <Column
            field="phone"
            header={t("PhoneNumber")}
            filter={true}
            sortable
            filterMatchMode="contains"
            filterPlaceholder={t("SearchByPhoneNumber")}
            showFilterMenu={false}
            style={{ textAlign: "center" }}
          ></Column>
          <Column
            field="email"
            header={t("Email")}
            filterPlaceholder={t("SearchByEmail")}
            filter={true}
            sortable
            filterMatchMode="contains"
            showFilterMenu={false}
            style={{ textAlign: "center" }}
          ></Column>

          <Column
            field="subject"
            header={t("Title")}
            dataType="text"
            style={{ width: "15rem", textAlign: "center" }}
            sortable
          />
          <Column
            field="content"
            filterPlaceholder={t("SearchByName")}
            header={t("Content")}
            style={{ textAlign: "center", width: "25%" }}
            filterMatchMode="contains"
          ></Column>
        </DataTable>
        <Dialog
          visible={modalVisible}
          modal
          style={{ maxWidth: "80vw", width: " 450px" }}
          headerClassName="p-1 "
          draggable
          className="p-0 border-bottom border-secondary-subtle supp-dialog card border-1 border shadow"
          onHide={() => {
            setModalVisible(false);
            setMessageRecivier(null);
          }}
          header={
            messageRecivier ? (
              <div className="user-profile p-3 border-bottom">
                <div className="user-details">
                  <span className="user-name"></span>
                  <span className="user-email">{messageRecivier.email}</span>
                </div>
              </div>
            ) : null
          }
        >
          <div className="supp-dialog-content card-body ">
            <h2 className="p-3 " style={{ fontSize: "1.5rem" }}>
              {messageRecivier && <strong>{messageRecivier.subject}</strong>}
            </h2>
            {messageRecivier && (
              <div className="supp-dialog-content support-message mx-5">
                <div className="supp-message-content">
                  <p className="text-muted">{messageRecivier.content}</p>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

ContactUs.propTypes = {
  t: PropTypes.func,
};