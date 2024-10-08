import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useState } from "react";
import { GraphData } from "./App";

interface UploadJsonProps {
  setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
}

const UploadJsonModal: React.FC<UploadJsonProps> = ({ setGraphData }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]); // Save the selected file to state
    }
  }

  const handleUpload = () => {
    if (!file) {
      return
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;

      try {
        const jsonData: GraphData = JSON.parse(content); // Parse the JSON file
        setGraphData(jsonData); // Update the GraphData in the parent component
        onClose(); // Close the modal after successful upload
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        // TODO: Show an error message to the user
      }
    }
    reader.onerror = () => {
      console.error("File reading has failed"); // Log file read errors
    };

    reader.readAsText(file); // Read the file as text
  }

  return (
    <>
      <Button onClick={onOpen}>Upload</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload JSON</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type="file" accept=".json" onChange={handleFileChange} />
            {file && <Box mt={4}>Selected File: {file.name}</Box>}
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleUpload} isDisabled={!file}>
              Upload
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );

}

interface UploadPaneProps {
  setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
}

const UploadPane: React.FC<UploadPaneProps> = ({ setGraphData }) => {
  return (
    <UploadJsonModal setGraphData={setGraphData} />
  )
}

export default UploadPane
