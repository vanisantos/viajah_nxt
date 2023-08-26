import { GptData } from "./map";
import { Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text } from "@chakra-ui/react";

export function PlacesCard(props:{places: GptData[]}) {
    const placesExists = props.places.length>0

    return (
        placesExists ? (
        <Card>
            <CardHeader>
            <Heading size='md'>Lugares que você não pode perder!</Heading>
            </CardHeader>
            
            <CardBody>
            {
            <Stack divider={<StackDivider />} spacing='4'>
                {props.places.map(place => {return(<Box>
                <Heading size='xs' textTransform='uppercase'>
                    {place.lugar}
                </Heading>
                <Text pt='2' fontSize='sm'>
                    {place.descricao}
                </Text>
                </Box>)
            })}
            </Stack>
            }
            </CardBody>
        </Card>
        ) : (<></>)
    )
}