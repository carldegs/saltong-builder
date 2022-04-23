import {
  Button,
  Code,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { CombinationData } from '../types/CombinationData';

interface ComboSelectModalProps extends Omit<ModalProps, 'children'> {
  combo?: CombinationData;
}

const ComboSelectModal: React.FC<ComboSelectModalProps> = ({
  isOpen,
  onClose,
  combo,
}) => {
  const { rootWord, letters, results } = combo || {};
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Combo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack fontSize="lg" mb={4}>
            <Text fontWeight="bold">{rootWord}</Text>
            <Code>{letters}</Code>
          </HStack>
          <Table variant="striped">
            <Thead>
              <Th>Center Letter</Th>
              <Th># Words</Th>
              <Th># Pangrams</Th>
              <Th>Max Score</Th>
              <Th>Actions</Th>
            </Thead>
            <Tbody>
              {Object.entries(results || {})
                .sort(([, a], [, b]) => a.numWords - b.numWords)
                .map(([centerLetter, { numWords, numPangrams, maxScore }]) => (
                  <Tr key={`${rootWord}/${centerLetter}/modal`}>
                    <Td>{centerLetter}</Td>
                    <Td>{numWords}</Td>
                    <Td>{numPangrams}</Td>
                    <Td>{maxScore}</Td>
                    <Td>
                      <Button colorScheme="green">Select</Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ComboSelectModal;
