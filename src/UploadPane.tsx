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
    const selectedFile = event.target.files![0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
    }
    else {
      alert("Please upload a valid JSON file.");
    }
  }

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonData = JSON.parse(e.target!.result);
        setGraphData(jsonData);
      };
      reader.readAsText(file);
      onClose();
    }
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
            <Button onClick={handleUpload}>
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
