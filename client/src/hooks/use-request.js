import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onFail, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, { ...body, ...props });

      if (onSuccess) onSuccess(res.data);

      return res.data;
    } catch (e) {
      console.log("FAILT USE REQ", e.data);
      if (e?.response && onFail) {
        const error = e.response.data.errors;

        if (
          error[0].message === "Email in use" ||
          error[0].message === "Invalid credentials"
        ) {
          return onFail({
            errors: [{ field: "email", message: "Email in use" }],
          });
        }

        onFail(e.response.data);

        setErrors(e.response.data);
      }
    }
  };

  return { doRequest, errors, onFail };
};

export default useRequest;
