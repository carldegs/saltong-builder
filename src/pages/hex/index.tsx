import {
  Box,
  Button,
  Code,
  Container,
  Flex,
  Heading,
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
import { useEffect, useState } from 'react';

import Layout from '../../layouts/Layout';
import useQueryHexCombo, {
  useMutateHexCombo,
} from '../../modules/hexcombo/queries';
import useQueryRoundData from '../../modules/round/queries';
import ComboSelectModal from '../../organisms/ComboSelectModal';
import { NAVBAR_HEIGHT } from '../../organisms/Navigation';
import { CombinationData } from '../../types/CombinationData';
import GameMode from '../../types/GameMode';
import { HexGameData } from '../../types/HexGameData';
import {
  getCurrHexRound,
  getDateString,
  getNextHexRound,
  showRange,
} from '../../utils';

const HexBuilder: React.FC = () => {
  // const addMutation = useMutateRoundData();
  const { data: roundData, isLoading: isLoadingRoundData } =
    useQueryRoundData<HexGameData>(GameMode.hex);
  const [newDate, setNewDate] = useState(getDateString());
  const generateHexCombo = useMutateHexCombo();
  const [newGameId, setNewGameId] = useState(0);
  const { data: hexCombo, isLoading: isFetchingHexCombo } = useQueryHexCombo();
  const [selectedCombo, setSelectedCombo] = useState<
    CombinationData | undefined
  >(undefined);

  useEffect(() => {
    const initData = Object.values(roundData || {});
    if (initData.length > 0) {
      const lastRound = initData[initData.length - 1];

      setNewDate(getDateString(getNextHexRound(lastRound.date)));
      setNewGameId(lastRound.gameId + 1);
    }
  }, [roundData]);

  return (
    <Layout>
      {selectedCombo && (
        <ComboSelectModal
          isOpen={!!selectedCombo}
          onClose={() => {
            setSelectedCombo(undefined);
          }}
          combo={selectedCombo}
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
          >
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
          {isLoadingRoundData || isFetchingHexCombo ? (
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
                                  setSelectedCombo(hexCombo[i]);
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
