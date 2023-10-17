import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";


// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  Badge,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import TablesTableRow from "components/Tables/TablesTableRow";
import { tablesProjectData, tablesTableData } from "variables/general";

import axios from 'axios';
import { COUNTER_STYLE } from "stylis";


function OrdersPicked() {

  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);


  let total = 267;

  useEffect(() => {
    getOrders();
    //paginateOrders();
    setPage(page + 1);
   }, []);


  const back = async() => {

    if(page>1){

      setPage(page - 1);
      getOrders();

    }

  }

  const next = async() => {
    
    console.log("Next: "+page);
    if(page<total){

      setPage(page + 1);
      getOrders();

    console.log("Next - : "+page);


    }


  }

  const getOrders = async () => {
    await axios.get(`http://127.0.0.1:5000/api/orders/get_picked_list?page=`+page).then(({data})=>{
      setOrders(data.data)

      total = data.last_page;
    })

  } 

  const paginateOrders = async () => {

    const formData = new FormData();
    formData.append('limit', 10);
    formData.append('page', 1);

    formData.append('limit', 10);

    await axios.post(`http://127.0.0.1:5000/api/orders/get_list`, formData).then(({data})=>{
      console.log(data);
    })
    
  }


  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Pedidos completados
          </Text>
        </CardHeader>
        {
                  orders && orders.length > 0 && (
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" color="gray.400">
                  Codigo
                </Th>
                <Th color="gray.400">Total</Th>
                <Th color="gray.400">Transportista</Th>
                <Th color="gray.400">Fecha</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>

                {
                  orders && orders.length > 0 && (
                    orders.map((row, key)=>(

                        <Tr key={key}>
                              <Td>
                                <Flex direction="column">
                                  <Text fontSize="md" color={textColor} fontWeight="bold">
                                    {row.code}
                                  </Text>
                                </Flex>
                              </Td>

                              <Td>
                                <Flex direction="column">
                                  <Text fontSize="md" color={textColor} fontWeight="bold">
                                    {row.total}
                                  </Text>
                                </Flex>
                              </Td>
                            <Td>
                              <Badge
                                bg={status === "1" ? "green.400" : bgStatus}
                                color={status === "1" ? "white" : colorStatus}
                                fontSize="16px"
                                p="3px 10px"
                                borderRadius="8px"
                              >
                                {row.name}
                              </Badge>
                            </Td>

                            <Td>
                                <Flex direction="column">
                                  <Text fontSize="md" color={textColor} fontWeight="bold">
                                  {row.updated_at}
                                  </Text>
                                </Flex>
                              </Td>
                              <Td>
                              <NavLink to={'#'}>
                                <Button p="0px" bg="transparent" variant="no-hover" >
                                  <Text
                                    fontSize="md"
                                    color="gray.400"
                                    fontWeight="bold"
                                    cursor="pointer"
                                  >Detalles
                                    
                                  </Text>
                                </Button>
                              </NavLink>
                              </Td>
                        </Tr>
                      ))
                  )
              }
            </Tbody>
          </Table>
        </CardBody>
                  )}
      </Card>
      <br/>

      {
                  orders && orders.length > 0 && (
        <Flex>

        <Button p="20px" onClick={(e) => back()}>
          <text>
              Atrás
          </text>
        </Button>

        <Button p="20px"  onClick={(e) => next()}>
          <text>
              Siguiente
          </text>
        </Button>

        </Flex>
                  )}
    </Flex>
  );
}

export default OrdersPicked;
