import { StarIcon } from '@chakra-ui/icons';
import {
  Button,
  Circle,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spinner,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
  TagRightIcon,
  Wrap,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import HexAnswer from '../types/HexAnswer';
import { getMaxScore, getNumPangrams } from '../utils';

interface HexAnswersSelectModalProps extends Omit<ModalProps, 'children'> {
  validWords?: HexAnswer[];
  selectedWords: string[];
  rootWord: string;
  centerLetter: string;
  onUpdate(word: string): void;
  onSubmit(): void;
}

const HexAnswersSelectModal: React.FC<HexAnswersSelectModalProps> = ({
  isOpen,
  onClose,
  validWords = [],
  selectedWords = [],
  rootWord = '',
  centerLetter = '',
  onUpdate,
  onSubmit,
}) => {
  const maxScore = useMemo(
    () => getMaxScore(validWords, selectedWords),
    [validWords, selectedWords]
  );

  const numPangrams = useMemo(
    () => getNumPangrams(validWords, selectedWords),
    [selectedWords, validWords]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      {!validWords.length ? (
        <ModalContent>
          <Spinner />
        </ModalContent>
      ) : (
        <ModalContent>
          <ModalHeader>Filter Words</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <StatGroup mb={4}>
              <Stat mr={3}>
                <StatLabel>Word</StatLabel>
                <StatNumber>{rootWord.toUpperCase()}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Center Letter</StatLabel>
                <StatNumber>{centerLetter.toUpperCase()}</StatNumber>
              </Stat>
              <Stat color={!selectedWords.length && 'red.500'}>
                <StatLabel>Words</StatLabel>
                <StatNumber>{selectedWords.length}</StatNumber>
              </Stat>
              <Stat color={!maxScore && 'red.500'}>
                <StatLabel>Max Score</StatLabel>
                <StatNumber>{maxScore}</StatNumber>
              </Stat>
              <Stat color={!numPangrams && 'red.500'}>
                <StatLabel>Pangrams</StatLabel>
                <StatNumber>{numPangrams}</StatNumber>
              </Stat>
            </StatGroup>
            <Wrap>
              {validWords.map(({ word, score, isPangram }) => (
                <Tag
                  key={`${word}/tag`}
                  size="lg"
                  borderRadius="full"
                  colorScheme={selectedWords.includes(word) ? 'green' : 'gray'}
                  cursor="pointer"
                  onClick={() => {
                    onUpdate(word);
                  }}
                >
                  <Circle
                    bg={selectedWords.includes(word) ? 'green.700' : 'gray.700'}
                    color="white"
                    opacity="0.5"
                    size="24px"
                    fontSize="sm"
                    mr={1}
                  >
                    {score}
                  </Circle>
                  <TagLabel>{word}</TagLabel>
                  {isPangram && <TagRightIcon as={StarIcon} />}
                </Tag>
              ))}
            </Wrap>
          </ModalBody>
          {/* <ModalBody>
            <Table variant="striped" size="sm">
              <Tbody>
                {validWords.map(({ word }) => (
                  <Tr key={word}>
                    <Td opacity={selectedWords.includes(word) ? 1 : 0.5}>
                      {word}
                    </Td>
                    <Td textAlign="right">
                      <Button
                        colorScheme={
                          selectedWords.includes(word) ? 'red' : 'green'
                        }
                        size="sm"
                        onClick={() => {
                          onUpdate(word);
                        }}
                      >
                        {selectedWords.includes(word) ? '-' : '+'}
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody> */}
          <ModalFooter>
            <Button
              onClick={() => {
                onSubmit();
                onClose();
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default HexAnswersSelectModal;
