import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import {
  MicroserviceOptions,
  Transport,
  ClientsModule,
  ClientGrpc,
  RpcException,
} from '@nestjs/microservices';
import { Model, Types } from 'mongoose';
import { Reaction, ReactionType } from '../src/reaction/reaction.schema';
import { getModelToken } from '@nestjs/mongoose';
import { clearDatebase } from './fixture/mongoose';
import { ReactionService } from './fixture/reaction.service';
import { status } from 'grpc';

describe('AppController (e2e)', () => {
  let app: INestMicroservice;
  let client: ClientGrpc;
  let service: ReactionService;
  let mongoose: Model<Reaction>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          {
            name: 'REACTION_PACKAGE',
            transport: Transport.GRPC,
            options: {
              url: '0.0.0.0:5000',
              package: ['reaction'],
              protoPath: ['reaction.proto'],
            },
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: ['reaction'],
        protoPath: ['reaction.proto'],
      },
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory: errors =>
          new RpcException({
            code: status.INVALID_ARGUMENT,
            message: errors.toString(),
          }),
      }),
    );

    client = app.get('REACTION_PACKAGE');
    service = client.getService<ReactionService>('ReactionService');
    mongoose = app.get(getModelToken(Reaction.name));

    await app.init();
    await app.listenAsync();

    clearDatebase<Reaction>(mongoose);
  });

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create reaction', async () => {
    const mockData = {
      upVote: [new Types.ObjectId],
      downVote: [new Types.ObjectId],
      reactionType: ReactionType.COMMENT
    };
    const response = await service.createReaction(mockData).toPromise();
    console.log(response)
    expect(response).toBeDefined()
  });

  it('shoule gets reaction', async () => {
    const selected = await service.getReactions({}).toPromise()
    console.log(selected)
  })

});
