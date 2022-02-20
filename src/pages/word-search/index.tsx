import {
  Button,
  Container,
  Flex,
  Input,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Layout from '../../layouts/Layout';
import useQueryWordlist from '../../modules/wordlist/queries';

const WordSearch: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQueryWordlist(router.query);

  return (
    <Layout>
      <Container
        maxW="container.xl"
        mt={4}
        onSubmit={(e) => {
          e.preventDefault();
          router.push({
            pathname: '/word-search',
            query: {
              search,
            },
          });
        }}
      >
        <Flex mb={8} as="form">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button type="submit">Search</Button>
        </Flex>

        {isLoading ? (
          <Spinner />
        ) : (
          <SimpleGrid columns={7}>
            {data.map((word) => (
              <Text key={word}>{word}</Text>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Layout>
  );
};

export default WordSearch;
