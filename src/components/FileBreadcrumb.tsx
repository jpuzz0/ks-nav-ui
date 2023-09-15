import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";

interface FileBreadcrumbProps {
  fileName: string | undefined;
}

export const FileBreadcrumb = ({ fileName }: FileBreadcrumbProps) => {
  const fileBreadcrumbItems = fileName?.includes("/") ? fileName.split("/") : [fileName];

  return (
    <Breadcrumb id="file-breadcrumb" style={{ paddingLeft: "20px" }}>
      {fileBreadcrumbItems.map((fileBreadcrumbItem, index) => (
        <BreadcrumbItem
          readOnly
          key={`${fileBreadcrumbItem}-${index}`}
          {...(index === fileBreadcrumbItems.length - 1 && { isActive: true })}
        >
          {fileBreadcrumbItem}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};
