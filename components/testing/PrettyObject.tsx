export default function PrettyObject({ 
  object, indentSize = 2 
}: {
  object: any,
  indentSize?: number
}) {
  function formatObject(inputObject: any, indentLevel: number): string {
    if (typeof inputObject !== "object" || inputObject === null) {
      return JSON.stringify(inputObject);
    }

    const indent = " ".repeat(indentLevel * indentSize);
    const childIndent = " ".repeat((indentLevel + 1) * indentSize);

    if (Array.isArray(inputObject)) {
      const arrayElements = inputObject
        .map(element => `${childIndent}${formatObject(element, indentLevel + 1)}`)
        .join(",\n");

      return `[\n${arrayElements}\n${indent}]`;
    } else {
      const objectKeys = Object.keys(inputObject);
      const objectProperties = objectKeys
        .map(
          key =>
            `${childIndent}${JSON.stringify(key)}: ${formatObject(
              inputObject[key],
              indentLevel + 1
            )}`
        )
        .join(",\n");

      return `{\n${objectProperties}\n${indent}}`;
    }
  };

  return (
    <pre>
      <code style={{
          fontFamily: "'Courier New', Courier, monospace"
      }}>{formatObject(object, 0)}</code>
    </pre>
  );
};