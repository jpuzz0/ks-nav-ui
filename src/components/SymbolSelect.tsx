import React from "react";

import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button,
  PopperProps,
} from "@patternfly/react-core";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";

import { useKsNavContext } from "../context";
import { SelectOptionType, Symbol } from "../types";
import { getSymbols, useFetchMockApi } from "../mockApi";

interface SymbolSelectProps {
  onSymbolSelect?(symbolName: string): void;
  placeholder?: string;
  isDisabled?: boolean;
}

export const SymbolSelect = ({
  placeholder = "Search by symbol name",
  isDisabled,
  onSymbolSelect,
}: SymbolSelectProps) => {
  const { setSelectedSymbol, selectedSymbol, selectedInstance } = useKsNavContext();
  const symbols: Symbol[] = useFetchMockApi(getSymbols, [selectedInstance?.id]) || [];

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectOptions, setSelectOptions] = React.useState<SelectOptionType[]>([]);
  const [inputValue, setInputValue] = React.useState<string | undefined>(selectedSymbol?.name);
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [focusedOptionIndex, setFocusedOptionIndex] = React.useState<number | null>(null);
  const [activeOptionId, setActiveOptionId] = React.useState<string | null>(null);
  const textInputRef = React.useRef<HTMLInputElement>();

  const initialSelectOptions: SelectOptionType[] = symbols.map((symbol) => ({
    value: symbol,
    label: symbol.name,
  }));

  // Update input value to reflect current context selected symbol
  React.useEffect(() => {
    setInputValue(selectedSymbol?.name);
  }, [selectedSymbol?.name]);

  React.useEffect(() => {
    let newSelectOptions: SelectOptionType[] = initialSelectOptions;

    // Filter options based on the text input value when one exists
    if (filterValue) {
      newSelectOptions = initialSelectOptions.filter((option) =>
        String(option.label).toLowerCase().includes(filterValue.toLowerCase())
      );

      // When no options are found after filtering, display 'No results found'
      if (!newSelectOptions.length) {
        newSelectOptions = [
          {
            isDisabled: true,
            label: `No results found for "${filterValue}"`,
            value: undefined,
          },
        ];
      }

      // Open the menu when the input value changes and the new value is not empty
      if (!isOpen) {
        setIsOpen(true);
      }
    }

    setSelectOptions(newSelectOptions);
    setActiveOptionId(null);
    setFocusedOptionIndex(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue, isOpen]);

  const onToggleClick = () => setIsOpen(!isOpen);

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: any) => {
    const symbol: Symbol = value;

    if (symbol) {
      setFilterValue("");
      setSelectedSymbol(symbol);
      setInputValue(symbol.name);
      onSymbolSelect?.(symbol.name);
    }
    setIsOpen(false);
    setFocusedOptionIndex(null);
    setActiveOptionId(null);
  };

  const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setInputValue(value as string);
    setFilterValue(value);

    if (value === "") {
      setSelectedSymbol(undefined);
      setIsOpen(false);
    }
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus = 0;

    if (isOpen) {
      if (key === "ArrowUp") {
        // When no index is set or at the first index, focus to the last, otherwise decrement focus index
        if (focusedOptionIndex === null || focusedOptionIndex === 0) {
          indexToFocus = selectOptions.length - 1;
        } else {
          indexToFocus = focusedOptionIndex - 1;
        }
      }

      if (key === "ArrowDown") {
        // When no index is set or at the last index, focus to the first, otherwise increment focus index
        if (focusedOptionIndex === null || focusedOptionIndex === selectOptions.length - 1) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedOptionIndex + 1;
        }
      }

      setFocusedOptionIndex(indexToFocus);
      const focusedOption = selectOptions.filter((option) => !option.isDisabled)[indexToFocus];
      setActiveOptionId(`symbol-select-${focusedOption.label?.replace(" ", "-")}`);
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledOptions = selectOptions.filter((option) => !option.isDisabled);
    const [firstOption] = enabledOptions;
    const focusedOption = focusedOptionIndex ? enabledOptions[focusedOptionIndex] : firstOption;

    switch (event.key) {
      // Select the first available option
      case "Enter":
        if (isOpen && !!focusedOption?.value) {
          setFilterValue("");
          setSelectedSymbol(focusedOption?.value);
          setInputValue(String(focusedOption.label));
          onSymbolSelect?.(focusedOption.label);
        }

        setIsOpen((prevIsOpen) => !prevIsOpen);
        setFocusedOptionIndex(null);
        setActiveOptionId(null);

        break;
      case "Tab":
      case "Escape":
        setIsOpen(false);
        setActiveOptionId(null);
        break;
      case "ArrowUp":
      case "ArrowDown":
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      onClick={onToggleClick}
      isExpanded={isOpen}
      isDisabled={isDisabled}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue ?? selectedSymbol?.name}
          onClick={onToggleClick}
          onChange={onTextInputChange}
          onKeyDown={onInputKeyDown}
          id="symbol-select-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder={placeholder}
          {...(activeOptionId && { "aria-activedescendant": activeOptionId })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="symbol-select-listbox"
        />

        <TextInputGroupUtilities>
          {!!inputValue && (
            <Button
              variant="plain"
              onClick={() => {
                setSelectedSymbol(undefined);
                setInputValue("");
                setFilterValue("");
                onSymbolSelect?.("");
                textInputRef?.current?.focus();
              }}
              aria-label="Clear input value"
            >
              <TimesIcon aria-hidden />
            </Button>
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      id="symbol-select"
      isOpen={isOpen}
      selected={selectedSymbol}
      onSelect={onSelect}
      onOpenChange={() => setIsOpen(false)}
      toggle={toggle}
      popperProps={{ appendTo: () => document.body } as PopperProps}
    >
      <SelectList id="symbol-select-listbox">
        {selectOptions?.map((option, index) => (
          <SelectOption
            key={option.label}
            isFocused={focusedOptionIndex === index}
            className={option.className}
            onClick={() => {
              const symbol: Symbol = option.value;

              onSymbolSelect?.(symbol.name);
              setSelectedSymbol(symbol);
            }}
            id={`symbol-select-${option.label?.replace(" ", "-")}`}
            {...option}
            ref={null}
          >
            {option.label}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
