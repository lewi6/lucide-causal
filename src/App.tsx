import React, { useState, useRef, useMemo, useEffect } from "react";
import * as math from "mathjs";
import { Calculator, Info } from "lucide-react";
// import { useGetOptions } from "./hooks/getCategory";

const sampleOptions = [
  { id: "1", label: "React", value: 9 },
  { id: "2", label: "Vue", value: 8 },
  { id: "3", label: "Angular", value: 7 },
  { id: "4", label: "Svelte", value: 8 },
  { id: "5", label: "Next.js", value: 9 },
  { id: "6", label: "Nuxt.js", value: 7 },
  { id: "7", label: "Gatsby", value: 6 },
  { id: "8", label: "Remix", value: 8 },
];

function App() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(sampleOptions);
  const inputRef = useRef<HTMLInputElement>(null);

  // const { data } = useGetOptions(inputValue, showOptions);

  const optionsMap = useMemo(() => {
    return new Map(sampleOptions.map((option) => [option.label, option.value]));
  }, []);

  console.log("optionsMap", optionsMap);

  useEffect(() => {
    if (showOptions) {
      const atIndex = inputValue.lastIndexOf("@");
      if (atIndex !== -1) {
        const searchTerm = inputValue.substring(atIndex + 1).trim();
        const filtered = sampleOptions.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOptions(filtered);
      } else {
        setFilteredOptions(sampleOptions);
      }
    }
  }, [inputValue, showOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowOptions(value.includes("@"));
  };

  const handleOptionSelect = (option: { label: string; value: number }) => {
    const atIndex = inputValue.lastIndexOf("@");

    if (atIndex !== -1) {
      const beforeAt = inputValue.substring(0, atIndex);
      let afterAtIndex = atIndex + 1;
      while (
        afterAtIndex < inputValue.length &&
        /[a-zA-Z0-9.]/.test(inputValue[afterAtIndex])
      ) {
        afterAtIndex++;
      }
      const afterAt = inputValue.substring(afterAtIndex);

      // Calculate the exact position where the cursor should be
      // const searchTerm = inputValue.substring(atIndex + 1, afterAtIndex);
      // const cursorOffset = searchTerm.length;
      const newInputValue = beforeAt + `@${option.label}` + afterAt;

      setInputValue(newInputValue);
      setShowOptions(false);

      // Position cursor after the inserted option name
      if (inputRef.current) {
        const newPosition = atIndex + option.label.length + 1; // +1 for @
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    }
  };

  const calculateResult = () => {
    try {
      const formulaWithValues = inputValue.replace(
        /@(\w+\.?\w*)/g,
        (match, label) => {
          const value = optionsMap.get(label);
          return value !== undefined ? value.toString() : match;
        }
      );
      const calculatedResult = math.evaluate(formulaWithValues);
      setResult(calculatedResult.toString());
    } catch (error) {
      setResult("Error: " + (error as Error).message);
    }
  };

  const renderFormattedInput = () => {
    if (!inputValue) {
      return (
        <span className="text-gray-400">
          Enter formula (e.g., 1+2^5 or 1+3*@React)
        </span>
      );
    }

    const parts = inputValue.split(/(@\w+\.?\w*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const label = part.substring(1);
        if (optionsMap.has(label)) {
          return (
            <span key={index} className="rounded bg-purple-100 text-purple-700">
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  return (
    <div className="flex w-screen">
      <div className="mx-auto min-h-screen w-fit bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Formula Calculator
            </h1>
            <p className="text-gray-600">
              Perform calculations with framework ratings
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="relative mb-4">
              <div className="relative flex items-center">
                <Calculator className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400" />
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter formula (e.g., 1+2^5 or 1+3*@React)"
                    className="w-full rounded-lg border-2 border-gray-200 bg-white py-3 pr-4 pl-10 font-mono text-transparent caret-black selection:bg-blue-200 selection:text-blue-900 focus:border-blue-400 focus:outline-none"
                  />
                  <div className="pointer-events-none absolute inset-0 py-3 pr-4 pl-10 font-mono text-gray-900">
                    {renderFormattedInput()}
                  </div>
                </div>
              </div>

              {showOptions && filteredOptions.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {filteredOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleOptionSelect(option)}
                      className="flex cursor-pointer items-center justify-between border-b border-gray-100 px-4 py-3 hover:bg-blue-50"
                    >
                      <span className="font-medium text-gray-700">
                        {option.label}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-600">
                        {option.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={calculateResult}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
              >
                Calculate
              </button>
              <div className="flex items-center rounded-lg bg-gray-50 px-4 py-2.5">
                <span className="mr-2 font-medium text-gray-600">Result:</span>
                <span className="font-mono text-lg font-semibold text-gray-800">
                  {result || "0"}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-blue-700">
                <Info className="h-5 w-5" />
                <span className="font-medium">Usage Tips</span>
              </div>
              <ul className="ml-5 list-disc space-y-1 text-sm text-blue-600">
                <li>Use standard math operators: +, -, *, /, ^</li>
                <li>Use parentheses for complex calculations</li>
                <li>Type @ to select from predefined framework ratings</li>
                <li>Try examples: 1+2^5, 1+3*@React, (@Vue + @Angular) / 2</li>
              </ul>
            </div>

            {/* <div className="mt-6">
            <h3 className="mb-3 font-medium text-gray-700">
              Available Framework Ratings
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sampleOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex flex-col items-center rounded-lg border border-gray-200 p-3 text-center"
                >
                  <span className="text-sm text-gray-600">{option.label}</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {option.value}
                  </span>
                </div>
              ))}
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
