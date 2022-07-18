package io.grpc.examples.mongoconnect;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.47.0)",
    comments = "Source: mongoconnect.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class MongoTestGrpc {

  private MongoTestGrpc() {}

  public static final String SERVICE_NAME = "mongoconnect.MongoTest";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<io.grpc.examples.mongoconnect.MongoRequest,
      io.grpc.examples.mongoconnect.MongoReply> getGetDocumentMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetDocument",
      requestType = io.grpc.examples.mongoconnect.MongoRequest.class,
      responseType = io.grpc.examples.mongoconnect.MongoReply.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<io.grpc.examples.mongoconnect.MongoRequest,
      io.grpc.examples.mongoconnect.MongoReply> getGetDocumentMethod() {
    io.grpc.MethodDescriptor<io.grpc.examples.mongoconnect.MongoRequest, io.grpc.examples.mongoconnect.MongoReply> getGetDocumentMethod;
    if ((getGetDocumentMethod = MongoTestGrpc.getGetDocumentMethod) == null) {
      synchronized (MongoTestGrpc.class) {
        if ((getGetDocumentMethod = MongoTestGrpc.getGetDocumentMethod) == null) {
          MongoTestGrpc.getGetDocumentMethod = getGetDocumentMethod =
              io.grpc.MethodDescriptor.<io.grpc.examples.mongoconnect.MongoRequest, io.grpc.examples.mongoconnect.MongoReply>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetDocument"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  io.grpc.examples.mongoconnect.MongoRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  io.grpc.examples.mongoconnect.MongoReply.getDefaultInstance()))
              .setSchemaDescriptor(new MongoTestMethodDescriptorSupplier("GetDocument"))
              .build();
        }
      }
    }
    return getGetDocumentMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static MongoTestStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MongoTestStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MongoTestStub>() {
        @java.lang.Override
        public MongoTestStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MongoTestStub(channel, callOptions);
        }
      };
    return MongoTestStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static MongoTestBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MongoTestBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MongoTestBlockingStub>() {
        @java.lang.Override
        public MongoTestBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MongoTestBlockingStub(channel, callOptions);
        }
      };
    return MongoTestBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static MongoTestFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MongoTestFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MongoTestFutureStub>() {
        @java.lang.Override
        public MongoTestFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MongoTestFutureStub(channel, callOptions);
        }
      };
    return MongoTestFutureStub.newStub(factory, channel);
  }

  /**
   */
  public static abstract class MongoTestImplBase implements io.grpc.BindableService {

    /**
     */
    public void getDocument(io.grpc.examples.mongoconnect.MongoRequest request,
        io.grpc.stub.StreamObserver<io.grpc.examples.mongoconnect.MongoReply> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetDocumentMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getGetDocumentMethod(),
            io.grpc.stub.ServerCalls.asyncUnaryCall(
              new MethodHandlers<
                io.grpc.examples.mongoconnect.MongoRequest,
                io.grpc.examples.mongoconnect.MongoReply>(
                  this, METHODID_GET_DOCUMENT)))
          .build();
    }
  }

  /**
   */
  public static final class MongoTestStub extends io.grpc.stub.AbstractAsyncStub<MongoTestStub> {
    private MongoTestStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MongoTestStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MongoTestStub(channel, callOptions);
    }

    /**
     */
    public void getDocument(io.grpc.examples.mongoconnect.MongoRequest request,
        io.grpc.stub.StreamObserver<io.grpc.examples.mongoconnect.MongoReply> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetDocumentMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class MongoTestBlockingStub extends io.grpc.stub.AbstractBlockingStub<MongoTestBlockingStub> {
    private MongoTestBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MongoTestBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MongoTestBlockingStub(channel, callOptions);
    }

    /**
     */
    public io.grpc.examples.mongoconnect.MongoReply getDocument(io.grpc.examples.mongoconnect.MongoRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetDocumentMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class MongoTestFutureStub extends io.grpc.stub.AbstractFutureStub<MongoTestFutureStub> {
    private MongoTestFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MongoTestFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MongoTestFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<io.grpc.examples.mongoconnect.MongoReply> getDocument(
        io.grpc.examples.mongoconnect.MongoRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetDocumentMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_GET_DOCUMENT = 0;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final MongoTestImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(MongoTestImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_GET_DOCUMENT:
          serviceImpl.getDocument((io.grpc.examples.mongoconnect.MongoRequest) request,
              (io.grpc.stub.StreamObserver<io.grpc.examples.mongoconnect.MongoReply>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  private static abstract class MongoTestBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    MongoTestBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return io.grpc.examples.mongoconnect.MongoConnectProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("MongoTest");
    }
  }

  private static final class MongoTestFileDescriptorSupplier
      extends MongoTestBaseDescriptorSupplier {
    MongoTestFileDescriptorSupplier() {}
  }

  private static final class MongoTestMethodDescriptorSupplier
      extends MongoTestBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    MongoTestMethodDescriptorSupplier(String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (MongoTestGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new MongoTestFileDescriptorSupplier())
              .addMethod(getGetDocumentMethod())
              .build();
        }
      }
    }
    return result;
  }
}
