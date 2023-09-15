import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  ButtonType,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Flex,
  Form,
  FormContextProvider,
  FormGroup,
  Popover,
  useFormContext,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";

import { FieldId } from "../types";
import { useKsNavContext } from "../context";
import { getFilePath, getInstanceVersion } from "../utils";
import { SymbolSelect, InstanceSelect } from "../components";
import { getFileDetails } from "../mockApi";

interface DatasetSearchPageInternalProps {
  instanceId: string | undefined;
}

const DatasetSearchPageInternal = ({ instanceId }: DatasetSearchPageInternalProps) => {
  const navigate = useNavigate();
  const { values, setValue } = useFormContext();
  const { [FieldId.SymbolName]: symbolName, [FieldId.InstanceVersion]: instanceVersion } = values;

  const onSearch = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const fileDetails = await getFileDetails(instanceId, symbolName);

      navigate(getFilePath(fileDetails?.id));
    },
    [symbolName, instanceId, navigate]
  );

  return (
    <Flex
      alignItems={{ default: "alignItemsCenter" }}
      justifyContent={{ default: "justifyContentCenter" }}
      direction={{ default: "column" }}
      style={{ height: "100%", backgroundColor: "#F0F0F0" }}
    >
      <Card isRounded isLarge style={{ width: "35%", padding: 30, minWidth: "500px" }}>
        <CardTitle style={{ textAlign: "center" }}>Kernel Symbol Navigator</CardTitle>

        <CardBody>
          <p className="pf-v5-u-mb-md pf-v5-u-color-400">
            A place to analyze kernel source code and understand function call trees using generated
            diagrams.
          </p>

          <Form>
            <FormGroup
              fieldId={FieldId.InstanceVersion}
              label="Dataset"
              labelIcon={
                <Popover bodyContent="Subset of the kernel based on a Linux version.">
                  <Button
                    variant="plain"
                    aria-label="Dataset select info icon"
                    className="pf-v5-c-form__group-label-help"
                  >
                    <HelpIcon />
                  </Button>
                </Popover>
              }
            >
              <InstanceSelect placeholder="Select a version" />
            </FormGroup>

            <FormGroup
              fieldId={FieldId.SymbolName}
              label="Symbol"
              labelIcon={
                <Popover bodyContent="Name of a kernel function or variable.">
                  <Button
                    variant="plain"
                    aria-label="Symbol select info icon"
                    className="pf-v5-c-form__group-label-help"
                  >
                    <HelpIcon />
                  </Button>
                </Popover>
              }
            >
              <SymbolSelect
                placeholder="Search by name"
                isDisabled={!instanceVersion}
                onSymbolSelect={(value) => setValue(FieldId.SymbolName, value)}
              />
            </FormGroup>
          </Form>
        </CardBody>
        <CardFooter>
          <Button
            type={ButtonType.submit}
            onClick={onSearch}
            isDisabled={!symbolName || !instanceVersion}
            style={{ width: "fit-content", float: "left" }}
          >
            Search
          </Button>
        </CardFooter>
      </Card>
    </Flex>
  );
};

export const DatasetSearchPage = () => {
  const { selectedSymbol, selectedInstance } = useKsNavContext();

  return (
    <FormContextProvider
      initialValues={{
        [FieldId.InstanceVersion]: getInstanceVersion(selectedInstance),
        [FieldId.SymbolName]: selectedSymbol?.name ?? "",
      }}
    >
      <DatasetSearchPageInternal instanceId={selectedInstance?.id} />
    </FormContextProvider>
  );
};
