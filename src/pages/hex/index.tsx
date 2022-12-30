import { DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Code,
  Container,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { isSameDay } from 'date-fns';

import { useHexSelection } from '../../hooks/useHexSelection';
import useJsonDownload from '../../hooks/useJsonDownload';
import Layout from '../../layouts/Layout';
import { useMutateHexCombo } from '../../modules/hexcombo/queries';
import ComboSelectModal from '../../organisms/ComboSelectModal';
import HexAnswersSelectModal from '../../organisms/HexAnswersSelectModal';
import { NAVBAR_HEIGHT } from '../../organisms/Navigation';
import { getCurrHexRound, getDateString, showRange } from '../../utils';

export enum HexSelectionState {
  init,
  centerLetterSelect,
  answersSelect,
}

const HexBuilder: React.FC = () => {
  // const addMutation = useMutateRoundData();
  const generateHexCombo = useMutateHexCombo();
  const {
    combo: selectedCombo,
    centerLetter: selectedCenterLetter,
    selectionState,
    answerList,
    selectedWords,
    roundData,
    newGameId,
    newDate,
    hexCombo,
    isLoading,
    onSelectCombo,
    onSelectCenterLetter,
    onBack,
    onUpdate,
    onSubmit,
  } = useHexSelection();
  const download = useJsonDownload();

  return (
    <Layout>
      {selectionState === HexSelectionState.centerLetterSelect && (
        <ComboSelectModal
          isOpen={selectionState === HexSelectionState.centerLetterSelect}
          onClose={onBack}
          onSelect={onSelectCenterLetter}
          combo={selectedCombo}
        />
      )}
      {selectionState === HexSelectionState.answersSelect && (
        <HexAnswersSelectModal
          isOpen={selectionState === HexSelectionState.answersSelect}
          onClose={onBack}
          validWords={answerList}
          selectedWords={selectedWords}
          onUpdate={onUpdate}
          onSubmit={onSubmit}
          rootWord={selectedCombo?.rootWord}
          centerLetter={selectedCenterLetter}
        />
      )}
      <Flex>
        {Object.keys(roundData || {})?.length && (
          <Flex
            flexGrow={1}
            bg="gray.100"
            flexDir="column"
            h={`calc(100vh - ${NAVBAR_HEIGHT})`}
            overflowY="auto"
            pos="relative"
          >
            <IconButton
              icon={<DownloadIcon />}
              aria-label="Download"
              onClick={() => {
                download(roundData, 'hexRound.json');
              }}
              pos="fixed"
              left="660px"
              bottom={4}
              colorScheme="teal"
            />
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Date</Th>
                  <Th>Root</Th>
                  <Th>CL</Th>
                  <Th>#W</Th>
                  <Th>MS</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.values(roundData).map(
                  ({
                    rootWord,
                    centerLetter,
                    date,
                    gameId,
                    words,
                    maxScore,
                  }) => (
                    <Tr
                      key={`${rootWord}/${centerLetter}/${date}`}
                      bg={
                        isSameDay(getCurrHexRound(), new Date(date))
                          ? 'blue.100'
                          : 'inherit'
                      }
                    >
                      <Td>{gameId}</Td>
                      <Td>{getDateString(new Date(date))}</Td>
                      <Td>{rootWord}</Td>
                      <Td>{centerLetter}</Td>
                      <Td>{words.length}</Td>
                      <Td>{maxScore}</Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </Flex>
        )}
        <Container
          maxW="container.lg"
          pt={4}
          flexGrow={2}
          h={`calc(100vh - ${NAVBAR_HEIGHT})`}
        >
          <Flex align="center" justify="space-between">
            <Heading
              fontSize="2xl"
              mb={4}
            >{`For Game #${newGameId} (${newDate})`}</Heading>
            <Button
              onClick={() => {
                generateHexCombo.mutate();
              }}
            >
              Generate
            </Button>
          </Flex>
          {isLoading ? (
            <Spinner />
          ) : (
            <Flex>
              {hexCombo?.length ? (
                <Box
                  h={`calc(100vh - ${NAVBAR_HEIGHT} - 80px)`}
                  overflowY="auto"
                  w="full"
                >
                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Root Word</Th>
                        <Th>LTR</Th>
                        <Th>#W</Th>
                        <Th>#P</Th>
                        <Th>MS</Th>
                        <Th>Options</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {hexCombo.map(
                        (
                          {
                            rootWord,
                            letters,
                            minWords,
                            maxWords,
                            minNumPangrams,
                            maxNumPangrams,
                            minMaxScore,
                            maxMaxScore,
                          },
                          i
                        ) => (
                          <Tr key={`${rootWord}/${letters}`}>
                            <Td>{rootWord}</Td>
                            <Td>
                              <Code letterSpacing="wide">{letters}</Code>
                            </Td>
                            <Td>{showRange(minWords, maxWords)}</Td>
                            <Td>{showRange(minNumPangrams, maxNumPangrams)}</Td>
                            <Td>{showRange(minMaxScore, maxMaxScore)}</Td>
                            <Td>
                              <Button
                                colorScheme="green"
                                onClick={() => {
                                  onSelectCombo(hexCombo[i]);
                                }}
                              >
                                Select
                              </Button>
                            </Td>
                          </Tr>
                        )
                      )}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Text>No list found. Select the generate button to begin.</Text>
              )}
            </Flex>
          )}
        </Container>
      </Flex>
    </Layout>
  );
};

export default HexBuilder;
