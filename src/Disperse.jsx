import React, { useEffect, useState } from "react";
import "./App.css";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
function Disperse() {
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [option, setOption] = useState("");
  const [message, setMessage] = useState("");
  const [unique, setUnique] = useState([]);
  const [duplicateError, setDuplicateError] = useState([]);

  const onSubmit = (values) => {
    const DataInArray = values?.data.split("\n");

    const array = [];
    for (let i = 0; i < DataInArray.length; i++) {
      const addressWithAmount = DataInArray[i];
      const a = /(,)/.test(addressWithAmount)
        ? addressWithAmount.split(",")
        : /( )/.test(addressWithAmount)
        ? addressWithAmount.split(" ")
        : /(=)/.test(addressWithAmount)
        ? addressWithAmount.split("=")
        : "";

      const isNumber = /^[0-9]*$/.test(a[1]);
      const isValid = /(,| |=)/.test(addressWithAmount);
      const isAmount = a[1] ? /[$-/:-?{-~!"^_`\[\]]/.test(a[1]) : true;
      if (!isValid || !isNumber || isAmount) {
        if ((!isNumber && isValid) || isAmount) {
          if (isAmount) {
            setDuplicate(false);

            setAmountError(
              a[1] ? `${a[0]}  ${a[1]} Invalid Amount` : "Amount Required"
            );
          } else {
            setDuplicate(false);

            setAmountError(`${a[0]}  ${a[1]} Amount should be a number `);
          }
        } else {
          setDuplicate(false);

          setError(`line number ${i + 1} wrong `);
        }
      } else {
        const a = /(,)/.test(addressWithAmount)
          ? addressWithAmount.split(",")
          : /( )/.test(addressWithAmount)
          ? addressWithAmount.split(" ")
          : /(=)/.test(addressWithAmount)
          ? addressWithAmount.split("=")
          : "";
        array.push({
          address: a[0],
          amount: a[1],
        });
      }
    }

    const temp = [];
    const duplicateData = [];
    const tempError = [];
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      console.log("item", item);
      const duplicate = temp.find((obj) => obj.address === item.address);

      if (!duplicate) {
        setMessage("success");
        temp.push({
          amount: item.amount,
          address: item.address,
          option: i,
        });
      } else {
        setMessage("");
        setDuplicate(true);
        const duplicateError = tempError.find((obj) => obj.error === item.address)
        console.log(duplicateError,"duplicateError");
        if(duplicateError){
          duplicateError.line.push(i+1)
        }else{
          tempError.push({
            error: duplicate.address,
            line:[duplicate.option+1,i+1]
          });
        }
        
        duplicateData.push({
          amount: item.amount,
          address: item.address,
          option: i,})
        temp.push({
          amount: item.amount,
          address: item.address,
          option: i,
        });
      }
      setUnique(temp);
      setDuplicateError(tempError);
    }
    console.log("tempError==>",tempError);
  };
  const handlechange = () => {
    const temp = [];

    if (option == "Combine") {
      for (let i = 0; i < unique.length; i++) {
        const combineElement = unique[i];

        const isValid = /^[0-9]*$/.test(combineElement.amount);
        if (!isValid) {
          setAmountError(
            `${combineElement.address}  ${combineElement.amount} Amount should be a number `
          );
        } else {
          const duplicate = temp.find(
            (obj) => obj.address === combineElement.address
          );
          if (duplicate) {
            duplicate.amount =
              parseInt(duplicate.amount) + parseInt(combineElement.amount);
          } else {
            temp.push(combineElement);
          }
        }
      }

      const StringArray = [];
      temp.map((a) => {
        StringArray.push(`${a.address} ${a.amount}`);
      });
      setValue("data", StringArray.join("\n"));
    } else {
      for (let i = 0; i < unique.length; i++) {
        const element = unique[i];
        const isValid = /^[0-9]*$/.test(element.amount);
        if (!isValid) {
          setDuplicate(false);

          setAmountError(
            `${element.address}  ${element.amount} Amount should be a number `
          );
        } else {
          const duplicate = temp.find((obj) => obj.address === element.address);
          if (!duplicate) {
            temp.push(element);
          }
        }
      }
      const keepArray = [];
      temp.map((a) => {
        keepArray.push(`${a.address} ${a.amount}`);
      });
      setValue("data", keepArray.join("\n"));
    }
  };
  useEffect(() => {
    handlechange();
    setError("");
    setAmountError("");
    setDuplicate(false);
    setMessage("");
    setOption("");
  }, [option]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className="col-12"
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "60%",
          margin: "150px 394px",
        }}
      >
        <h3 style={{ color: "#8389a0" }}>Addressess with Amount</h3>
        <textarea
          className="numbered col-12"
          {...register("data")}
          style={{ width: "100%" }}
          rows={5}
          onChange={() => {
            setError("");
            setAmountError("");
            setMessage("");
          }}
        ></textarea>
        <h5 style={{ color: "#8389a0" }}>separated by ',' or '' or '='</h5>
        <div
          style={{
            width: "100%",
            color: "green",
            marginTop: "9px",
          }}
        >
          {message != "" &&
            error == "" &&
            amountError == "" &&
            duplicateError.length && <p>{message}</p>}
        </div>
        <div
          style={{
            width: "100%",
            color: "red",
            marginTop: "9px",
          }}
        ></div>

        <div
          style={{
            width: "100%",
            border: error ? "1px solid red" : "",
            color: "red",
            borderRadius: "6px",
            marginTop: "9px",
          }}
        >
          {error != "" && amountError !== "" && (
            <p>
              {error} , {amountError}
            </p>
          )}
          {error != "" ||
            (amountError !== "" && <p>{error ? error : amountError}</p>)}
        </div>

        {duplicate && duplicateError.length && (
          <div
            style={{
              width: "100%",
              border: error ? "1px solid red" : "",
              color: "red",
              borderRadius: "6px",
              marginTop: "9px",
            }}
          >
            {duplicateError?.map((a) => {
              return <h5>{`Address ${a.error} encountered duplicate in line:${a.line.toString()}`}</h5>;
            })}
          </div>
        )}

        {duplicate && (
          <>
            {" "}
            <Button
              className="my-2 col-12"
              type="submit"
              style={{
                width: "45%",
                background: "#1538a1",
                color: "white",
                borderRadius: "6px",
                marginTop: "9px",
              }}
              onClick={() => {
                setOption("Keep");
              }}
            >
              Keep First
            </Button>{" "}
            <Button
              className="mx-2 "
              type="submit"
              style={{
                width: "45%",
                background: "#1538a1",
                color: "white",
                borderRadius: "6px",
                marginTop: "9px",
                marginLeft: "75px",
              }}
              onClick={() => {
                setOption("Combine");
              }}
            >
              Combine
            </Button>
          </>
        )}

        <Button
          className="my-2 "
          type="submit"
          style={{
            width: "100%",
            background: "#1538a1",
            color: "white",
            borderRadius: "6px",
            marginTop: "9px",
          }}
        >
          Next
        </Button>
      </div>
    </form>
  );
}

export default Disperse;
