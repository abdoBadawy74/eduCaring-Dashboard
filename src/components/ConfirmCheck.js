import { ConfirmPopup } from "primereact/confirmpopup";
import PropTypes from "prop-types";

function ConfirmCheck({
  visible,
  onHide,
  message,
  icon,
  accept,
  reject,
  target,
}) {
  const handleAccept = () => {
    accept(); // Call the accept function provided through props
    onHide(); // Hide the dialog
  };

  const handleReject = () => {
    reject(); // Call the reject function provided through props
    onHide(); // Hide the dialog
  };

  return (
    <ConfirmPopup
      visible={visible}
      onHide={onHide}
      message={message}
      icon={icon}
      style={{ width: "fit-content" }}
      acceptClassName=" p-button-danger"
      className="d-flex justify-content-center flex-column align-items-center gap-3"
      accept={handleAccept} // Use the local handleAccept function
      reject={handleReject} // Use the local handleReject function
      target={target}
    />
  );
}

ConfirmCheck.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  accept: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  target: PropTypes.string.isRequired,
};

export default ConfirmCheck;
