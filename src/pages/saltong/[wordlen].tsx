import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Layout from '../../layouts/Layout';
import useQueryRoundData from '../../modules/round/queries';
import useQueryWordlist from '../../modules/wordlist/queries';
import { NAVBAR_HEIGHT } from '../../organisms/Navigation';
import GameData from '../../types/GameData';
import GameMode from '../../types/GameMode';

const getSaltongMode = (wordlen: number) => {
  switch (wordlen) {
    case 4:
      return GameMode.mini;
    case 5:
      return GameMode.main;
    case 7:
      return GameMode.max;
    default:
      return undefined;
  }
};

const Saltong: React.FC = () => {
  const { query } = useRouter();
  const { data: wordlist, isLoading } = useQueryWordlist(query);
  const { data: roundData, isLoading: isLoadingRoundData } = useQueryRoundData(
    getSaltongMode(Number(query.wordlen))
  );
  const [showAll, setShowAll] = useState(false);
  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState([]);

  const filteredWordlist = useMemo(() => {
    if (!wordlist?.length) {
      return [];
    }

    const usedWords = Object.values(
      (roundData || {}) as unknown as GameData
    ).map(({ word }) => word);
    return wordlist.filter((word) => !usedWords.includes(word));
  }, [roundData, wordlist]);

  const getRandomWords = useCallback(() => {
    setRandomWords(
      (filteredWordlist || []).sort(() => 0.5 - Math.random()).slice(0, 10)
    );
  }, [filteredWordlist]);

  console.log(roundData, isLoadingRoundData);
  return (
    <Layout>
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
                  <Th>Game ID</Th>
                  <Th>Date</Th>
                  <Th>Word</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.values(roundData as unknown as GameData).map(
                  ({ word, date, gameId }) => (
                    <Tr key={`${word}-${date}`}>
                      <Td>{gameId}</Td>
                      <Td>{date}</Td>
                      <Td>{word}</Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </Flex>
        )}
        <Container maxW="container.xl" mt={4} flexGrow={2}>
          {isLoading || isLoadingRoundData ? (
            <Spinner />
          ) : (
            <SimpleGrid columns={5} spacing={4}>
              {(showAll ? filteredWordlist : randomWords).map((word) => (
                <Button
                  key={word}
                  onClick={() => {
                    setSelectedWords((words) => [...words, word]);
                    getRandomWords();
                  }}
                >
                  {word}
                </Button>
              ))}
            </SimpleGrid>
          )}

          <Button onClick={getRandomWords}>Get new words</Button>

          <SimpleGrid columns={5} spacing={4}>
            {selectedWords.map((word) => (
              <Text key={`selected-${word}`}>{word}</Text>
            ))}
          </SimpleGrid>
        </Container>
      </Flex>
    </Layout>
  );
};

export default Saltong;
