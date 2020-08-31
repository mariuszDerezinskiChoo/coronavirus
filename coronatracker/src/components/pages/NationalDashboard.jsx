import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Dropdown,
    DropdownButton,
} from "react-bootstrap";
import USAMap from "../USAMap";
import { Link } from "react-router-dom";
import StateTable from "components/StateTable";
import { StateChart } from "components/StateChart";
import { Chart } from "components/Chart";
import { TimeSeriesGraph } from "components/TimeSeriesGraph";
import { StyledCard } from "components/StyledCard";
import { StatsCard } from "components/StatsCard";
import firebase from "../../firebase";
import { useStateData, useStateTimeSeries } from "../../hooks";
import axios from "axios";

const optionsMap = {
    confirmed: "Confirmed Cases",
    death: "Deaths",
    newConfirmed: "New Cases",
    newDeath: "New Deaths",
    positive: "Cases",
    hospitalizedCurrently: "Hospitalized Currently",
    inIcuCurrently: "in ICU Currently",
    onVentilatorCurrently: "on Ventilator Currently",
    recovered: "Recovered",
    death: "Deaths",
    positiveIncrease: "New Cases",
    totalTestResults: "Tests",
    deathIncrease: "New Deaths",
    "positive-rate": "Daily Positive Test Rate",
};
export function NationalDashboard() {
    const [currentStateSelected, setCurrentStateSelected] = useState(
        "New York"
    );
    const [nationalData, setNationalData] = useState({});
    const [nationalTimeSeries, setNationalTimeSeries] = useState([]);
    const [date, setDate] = useState("");
    const { stateData } = useStateData(date);
    const [dataOptions, setDataOptions] = useState(["confirmed", "death"]);
    const [nationalTimeSeriesOptions, setNationalTimeSeriesOptions] = useState(
        "positive"
    );
    const [stateHistoricalData, setStateHistoricalData] = useState([]);
    const { stateTimeSeries } = useStateTimeSeries(currentStateSelected);

    const handleChangeOptions = (option) => {
        setNationalTimeSeriesOptions(option);
    };
    const handleChangeOptions0 = (option) => {
        setDataOptions([option, dataOptions[1]]);
    };
    const handleChangeOptions1 = (option) => {
        setDataOptions([dataOptions[0], option]);
    };
    const changeState = (usState) => {
        setCurrentStateSelected(usState);
    };
    useEffect(() => {
        firebase
            .firestore()
            .collection("Countries")
            .doc("UnitedStates")
            .get()
            .then((doc) => {
                console.log(doc.data());
                setDate(doc.data().lastUpdated);
            });
        axios
            .get("https://api.covidtracking.com/v1/us/current.json")
            .then((res) => {
                setNationalData(res.data[0]);
                console.log(nationalData);
            });

        axios
            .get("https://api.covidtracking.com/v1/us/daily.json")
            .then((res) => {
                setStateHistoricalData(res.data.reverse());
                //console.log(res.data.filter(function(entry) {return entry.state == 'NY'}))
                // setStateHistoricalData(['a'])
                // console.log("aljsdkfalksdf")
                //console.log(stateHistoricalData)
            });

        axios
            .get("https://api.covidtracking.com/v1/us/daily.json")
            .then((res) => {
                console.log(res.data);
                setNationalTimeSeries(res.data.reverse());
            });
    }, []);

    return (
        <Container fluid>
            <Row className="mt-4">
                <Col lg={3} sm={6}>
                    <StatsCard
                        title="Total US Cases"
                        color="primary"
                        stat={nationalData.positive}
                    ></StatsCard>
                </Col>
                <Col lg={3} sm={6}>
                    <StatsCard
                        title="Total US Deaths"
                        color="danger"
                        stat={nationalData.death}
                    ></StatsCard>
                </Col>
                <Col lg={3} sm={6}>
                    <StatsCard
                        title="US Hospitalized"
                        color="warning"
                        stat={nationalData.hospitalizedCurrently}
                    ></StatsCard>
                </Col>
                <Col lg={3} sm={6}>
                    <StatsCard
                        title="US Recovered"
                        color="success"
                        stat={nationalData.recovered}
                    ></StatsCard>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <StyledCard
                        title="National Map"
                        subtitle={
                            currentStateSelected +
                            " (Click on a state to get more info)"
                        }
                    >
                        <USAMap handleSelectState={changeState} />
                    </StyledCard>
                </Col>
                <Col sm={12} md={6}>
                    {/* <Card>
            <Card.Body>
              <StateTable stateData={stateData} />
            </Card.Body>
          </Card> */}
                    <StyledCard
                        title="US States"
                        subtitle={"Data valid through: " + date}
                        footer={
                            <Link to="/info">
                                <p>About our data</p>
                            </Link>
                        }
                    >
                        <StateTable
                            handleClick={changeState}
                            stateData={stateData}
                        />
                    </StyledCard>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={10}>
                    <StyledCard
                        title={
                            "Total US " + optionsMap[nationalTimeSeriesOptions]
                        }
                        titleComponent={
                            <DropdownButton
                                className="float-right"
                                onSelect={handleChangeOptions}
                            >
                                <Dropdown.Item eventKey="positive">
                                    Confirmed Cases
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="death">
                                    Deaths
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="positiveIncrease">
                                    New Cases
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="deathIncrease">
                                    New Deaths
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="positive-rate">
                                    Daily Positive Test Rate
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="recovered">
                                    Recovered
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="totalTestResults">
                                    Total Tests
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="hospitalizedCurrently">
                                    Hospitalized Currently
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="inIcuCurrently">
                                    ICU Currently
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="onVentilatorCurrently">
                                    Ventilator Currently
                                </Dropdown.Item>
                            </DropdownButton>
                        }
                    >
                        <TimeSeriesGraph
                            option={nationalTimeSeriesOptions}
                            data={nationalTimeSeries}
                        />
                    </StyledCard>
                </Col>
            </Row>

            {/* <Row>
        <Col md={10}>
            <StyledCard 
              title={"NY"}
            >
                <TimeSeriesGraph option={'positive'} data={stateHistoricalData.filter(function(entry) {return entry.state == 'NY'})}/>
            </StyledCard>
        </Col>
      </Row> */}

            <Row>
                <Col md={6}>
                    <StyledCard
                        title={
                            currentStateSelected +
                            " " +
                            optionsMap[dataOptions[0]]
                        }
                        titleComponent={
                            <DropdownButton
                                className="float-right"
                                onSelect={handleChangeOptions0}
                            >
                                <Dropdown.Item eventKey="confirmed">
                                    Confirmed Cases
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="death">
                                    Deaths
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="newConfirmed">
                                    New Cases
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="newDeath">
                                    New Deaths
                                </Dropdown.Item>
                            </DropdownButton>
                        }
                    >
                        <Chart
                            timeSeries={stateTimeSeries}
                            title={currentStateSelected}
                            type={dataOptions[0]}
                            label={currentStateSelected}
                        />

                        {/* <StateChart state={currentStateSelected}/> */}
                    </StyledCard>
                </Col>

                <Col md={6}>
                    <StyledCard
                        title={
                            currentStateSelected +
                            " " +
                            optionsMap[dataOptions[1]]
                        }
                        titleComponent={
                            <DropdownButton
                                className="float-right"
                                onSelect={handleChangeOptions1}
                            >
                                <Dropdown.Item eventKey="confirmed">
                                    Confirmed Cases
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="death">
                                    Deaths
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="newConfirmed">
                                    New Cases
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="newDeath">
                                    New Deaths
                                </Dropdown.Item>
                            </DropdownButton>
                        }
                    >
                        <Chart
                            timeSeries={stateTimeSeries}
                            title={currentStateSelected}
                            type={dataOptions[1]}
                            label={currentStateSelected}
                        />
                        {/* <StateChart data='death' state={currentStateSelected}/> */}
                    </StyledCard>
                </Col>
            </Row>
        </Container>
    );
}
