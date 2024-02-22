import { XCircleIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { isAddress } from "viem";
// import Papa from 'papaparse';

// mock address List
// 0x1fae896f3041d7e8Bf5Db08cAd6518b0Eb82164a,0x17670B6512e68574eb5398d5117266F9D45aE637,0x0Eb330289A532a3da281717519b368c145De7fbA

const AddressListInput: React.FC = () => {
  const [addresses, setAddresses] = useState(new Set<string>());
  const [errorTxt, setErrorTxt] = useState("");
  const [mode, setMode] = useState(0);

  const handleInputAddAddress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setErrorTxt("");
    let input = e.currentTarget.value.trim();
    if (e.key === "Enter") {
      if (isAddress(input)) {
        if (addresses.has(input)) {
          setErrorTxt(`Address already exsist`);
          return;
        }
        setAddresses((prev) => {
          const newSet = new Set(prev);
          newSet.add(input);
          return newSet;
        });
        e.currentTarget.value = "";
      } else {
        setErrorTxt(`Invalid address`);
        return;
      }
    }
  };

  const handleTextareaAddAddress = debounce(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setErrorTxt("");
      let input = e.target.value.trim();
      let newSet = new Set(addresses);
      const addrs = input.split(/[\n,;]+/).filter(Boolean);
      for (let i = 0; i < addrs.length; i++) {
        const addr = addrs[i];
        if (!addr) continue;
        if (isAddress(addr)) {
          if (addresses.has(addr)) {
            // setErrorTxt(`${addr} already exsist`);
            continue;
          }
          newSet.add(addr);
        } else {
          setErrorTxt(`${addr} is a invalid address`);
          continue;
        }
      }

      e.target.value = "";
      setAddresses(newSet);
    },
    500
  );

  const handleRemoveAddress = (_address: string) => {
    setAddresses((prev) => {
      const newSet = new Set(prev);
      newSet.delete(_address);
      return newSet;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result?.toString();
        if (file.name.endsWith(".json")) {
          const json = JSON.parse(text!);
          // 假设 JSON 文件格式是数组 ["0x...", "0x..."]
          const validAddresses = json.filter((addr: string) => isAddress(addr));
          setAddresses(validAddresses);
        } else if (file.name.endsWith(".csv")) {
          // Papa.parse(text!, {
          //   complete: (results) => {
          //     const validAddresses = results.data.filter((row: string[]) => isAddress(row[0]));
          //     setAddresses(validAddresses.map((row: string[]) => row[0]));
          //   }
          // });
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {}, [addresses]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div role="tablist" className="tabs">
          <a
            role="tab"
            className={`tab ${
              mode == 0 ? "text-base-content" : "text-slate-500"
            }`}
            onClick={() => setMode(0)}
          >
            single input
          </a>
          <a
            role="tab"
            className={`tab ${
              mode == 1 ? "text-base-content" : "text-slate-500"
            }`}
            onClick={() => setMode(1)}
          >
            multiple input
          </a>
          <a
            role="tab"
            className={`tab  ${
              mode == 2 ? "text-base-content" : "text-slate-500"
            }`}
            onClick={() => setMode(2)}
          >
            import file
          </a>
        </div>
        <div className="text-slate-500 text-sm">
          total <span className="font-bold">{addresses.size}</span>
        </div>
      </div>
      {mode == 0 && (
        <>
          <div className="flex">
            <input
              placeholder="input address and press enter"
              className="textarea textarea-bordered flex-1 mr-4"
              onKeyDown={handleInputAddAddress}
            />
          </div>
          {errorTxt ? (
            <div className="my-1 min-h-3 text-error font-bold text-sm">
              {errorTxt}
            </div>
          ) : (
            <div className="my-1 min-h-3 text-slate-500 text-sm">
              Input address and press <span className="font-bold">Enter</span>.
            </div>
          )}
        </>
      )}
      {mode == 1 && (
        <>
          <div className="flex">
            <textarea
              placeholder="input address and press enter"
              className="textarea textarea-bordered flex-1 mr-4"
              onChange={handleTextareaAddAddress}
            />
          </div>
          {errorTxt ? (
            <div className="my-1 min-h-3 text-error font-bold text-sm">
              {errorTxt}
            </div>
          ) : (
            <div className="my-1 min-h-3 text-slate-500 text-sm">
              Enter a list of addresses, separated by{" "}
              <span className="font-bold">comma, semicolon, or new line</span>.
            </div>
          )}
        </>
      )}

      {mode == 2 && (
        <label>
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="btn">Choose File</span>
        </label>
      )}

      <div
        className={`overflow-y-auto min-h-40 max-h-[30vh] rounded-xl border p-4 ${
          addresses.size === 0 ? "bg-base-200" : ""
        }`}
      >
        {Array.from(addresses).map((address, index) => (
          <div
            key={index}
            className="badge badge-xl w-full rounded-none py-4 pl-4 pr-10 relative overflow-hidden mb-1"
          >
            {address}
            <div
              className="absolute px-1 py-2 right-0 bg-error cursor-pointer"
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveAddress(address);
              }}
            >
              <XCircleIcon className="w-5 text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressListInput;