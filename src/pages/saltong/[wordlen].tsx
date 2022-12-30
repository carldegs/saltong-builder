import { DownloadIcon } from '@chakra-ui/icons';
import {
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { addDays, isSameDay } from 'date-fns';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import useJsonDownload from '../../hooks/useJsonDownload';
import Layout from '../../layouts/Layout';
import useQueryRoundData, {
  useMutateRoundData,
} from '../../modules/round/queries';
import useQueryWordlist from '../../modules/wordlist/queries';
import { NAVBAR_HEIGHT } from '../../organisms/Navigation';
import GameData from '../../types/GameData';
import GameMode from '../../types/GameMode';
import { getDateString } from '../../utils';

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
  const addMutation = useMutateRoundData();
  const mode = useMemo(
    () => getSaltongMode(Number(query.wordlen)),
    [query.wordlen]
  );
  const { data: roundData, isLoading: isLoadingRoundData } =
    useQueryRoundData<GameData>(mode);
  const [showAll] = useState(false);
  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [newDate, setNewDate] = useState(getDateString());
  const [newGameId, setNewGameId] = useState(0);
  const download = useJsonDownload();
  const filename = useMemo(() => {
    let mode = '';

    switch (+query.wordlen) {
      case 5:
        mode = 'main';
        break;
      case 7:
        mode = 'max';
        break;
      case 4:
        mode = 'mini';
        break;
    }

    return `${mode}Round.json`;
  }, [query.wordlen]);

  const filteredWordlist = useMemo(() => {
    if (!wordlist?.length) {
      return [];
    }

    const usedWords = Object.values(roundData || {}).map(({ word }) => word);
    return wordlist.filter((word) => !usedWords.includes(word));
  }, [roundData, wordlist]);

  const getRandomWords = useCallback(() => {
    setRandomWords(
      (filteredWordlist || []).sort(() => 0.5 - Math.random()).slice(0, 10)
    );
  }, [filteredWordlist]);

  useEffect(() => {
    const initData = Object.values(roundData || {});
    if (initData.length > 0) {
      const lastRound = initData[initData.length - 1];

      setNewDate(getDateString(addDays(new Date(lastRound.date), 1)));
      setNewGameId(lastRound.gameId + 1);
    }
  }, [roundData]);

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
            pos="relative"
          >
            <IconButton
              icon={<DownloadIcon />}
              aria-label="Download"
              onClick={() => {
                download(roundData, filename);
              }}
              pos="fixed"
              left="400px"
              bottom={4}
              colorScheme="teal"
            />
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Game ID</Th>
                  <Th>Date</Th>
                  <Th>Word</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {Object.values(roundData).map(({ word, date, gameId }) => (
                  <Tr
                    key={`${word}-${date}`}
                    bg={
                      isSameDay(new Date(), new Date(date))
                        ? 'blue.100'
                        : 'inherit'
                    }
                  >
                    <Td>{gameId}</Td>
                    <Td>{getDateString(new Date(date))}</Td>
                    <Td>{word}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        )}
        <Container maxW="container.xl" mt={4} flexGrow={2}>
          <Heading
            fontSize="2xl"
            mb={4}
          >{`For Game #${newGameId} (${newDate})`}</Heading>
          {isLoading || isLoadingRoundData ? (
            <Spinner />
          ) : (
            <SimpleGrid columns={5} spacing={4}>
              {(showAll ? filteredWordlist : randomWords).map((word) => (
                <Button
                  key={word}
                  onClick={() => {
                    addMutation.mutate({
                      mode,
                      roundData: {
                        date: newDate,
                        gameId: newGameId,
                        word,
                      } as GameData,
                    });
                    getRandomWords();
                  }}
                >
                  {word}
                </Button>
              ))}
            </SimpleGrid>
          )}

          <Button onClick={getRandomWords} isFullWidth mt={4}>
            Get new words
          </Button>
        </Container>
      </Flex>
    </Layout>
  );
};

export default Saltong;
