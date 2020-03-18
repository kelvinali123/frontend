import Page from 'components/Page';
import React from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
    Alert,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    CardImg,
    CardTitle,
    CardSubtitle,
    CardText,
    Progress, 
} from 'reactstrap';
import { MdAdd, MdAssignment, MdLoyalty } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import User from './UserPage';
import register from './../registerServiceWorker';

var BACKEND;



class test extends React.Component {




render() {
    return (
<Page>

<Alert color="success">
        BACOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOT
      </Alert>

      <Alert color="danger">
        BACOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOT
      </Alert>

      <Card>
        <CardImg top width="100%" src="https://mmc.tirto.id/image/otf/500x0/2019/03/28/iu-instagram_ratio-16x9.jpg" alt="Test" />
        <CardBody>
          <CardTitle>Vote</CardTitle>
          <CardSubtitle>How to vote?</CardSubtitle>
          <CardText>Press vote button</CardText>
         
          <div className="text-center">Progress</div>
      <Progress value="95" />

        </CardBody>
        <Button>Vote</Button>
      </Card>
      
</Page>
    
    
        );
    }

}


export default test;