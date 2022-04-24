import { WarningIcon } from '@chakra-ui/icons';
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

import useHexCheckUsed from '../hooks/useHexCheckUsed';
import { CombinationData } from '../types/CombinationData';

interface ComboSelectModalProps extends Omit<ModalProps, 'children'> {
  combo?: CombinationData;
  onSelect(centerLetter: string): void;
}

const ComboSelectModal: React.FC<ComboSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  combo,
}) => {
  const { rootWord, letters, results } = combo || {};
  const centerLettersUsed = useHexCheckUsed(rootWord);

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
          <Table variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>Center Letter</Th>
                <Th># Words</Th>
                <Th># Pangrams</Th>
                <Th>Max Score</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(results || {})
                .sort(([, a], [, b]) => a.numWords - b.numWords)
                .map(([centerLetter, { numWords, numPangrams, maxScore }]) => {
                  const isUsed = centerLettersUsed.includes(centerLetter);
                  return (
                    <Tr
                      key={`${rootWord}/${centerLetter}/modal`}
                      color={isUsed && 'orange.500'}
                    >
                      <Td>
                        <Text mr={2} as="span">
                          {centerLetter.toUpperCase()}
                        </Text>
                        {isUsed && <WarningIcon />}
                      </Td>
                      <Td>{numWords}</Td>
                      <Td>{numPangrams}</Td>
                      <Td>{maxScore}</Td>
                      <Td>
                        <Button
                          colorScheme={isUsed ? 'orange' : 'green'}
                          onClick={() => {
                            onSelect(centerLetter);
                          }}
                          rightIcon={isUsed && <WarningIcon />}
                          w="full"
                        >
                          Select
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ComboSelectModal;
