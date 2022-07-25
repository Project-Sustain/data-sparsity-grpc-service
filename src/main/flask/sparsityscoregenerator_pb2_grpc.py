# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import sparsityscoregenerator_pb2 as sparsityscoregenerator__pb2


class GetRequestParamsStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.TemporalRange = channel.unary_unary(
                '/sparsityscoregenerator.GetRequestParams/TemporalRange',
                request_serializer=sparsityscoregenerator__pb2.TRRequest.SerializeToString,
                response_deserializer=sparsityscoregenerator__pb2.TRReply.FromString,
                )


class GetRequestParamsServicer(object):
    """Missing associated documentation comment in .proto file."""

    def TemporalRange(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_GetRequestParamsServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'TemporalRange': grpc.unary_unary_rpc_method_handler(
                    servicer.TemporalRange,
                    request_deserializer=sparsityscoregenerator__pb2.TRRequest.FromString,
                    response_serializer=sparsityscoregenerator__pb2.TRReply.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'sparsityscoregenerator.GetRequestParams', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class GetRequestParams(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def TemporalRange(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/sparsityscoregenerator.GetRequestParams/TemporalRange',
            sparsityscoregenerator__pb2.TRRequest.SerializeToString,
            sparsityscoregenerator__pb2.TRReply.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)


class FindSparsityScoresStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.CheckServerConnection = channel.unary_unary(
                '/sparsityscoregenerator.FindSparsityScores/CheckServerConnection',
                request_serializer=sparsityscoregenerator__pb2.ConnectionRequest.SerializeToString,
                response_deserializer=sparsityscoregenerator__pb2.ConnectionReply.FromString,
                )
        self.CheckDatabaseConnection = channel.unary_unary(
                '/sparsityscoregenerator.FindSparsityScores/CheckDatabaseConnection',
                request_serializer=sparsityscoregenerator__pb2.ConnectionRequest.SerializeToString,
                response_deserializer=sparsityscoregenerator__pb2.ConnectionReply.FromString,
                )
        self.CalculateSparsityScores = channel.unary_stream(
                '/sparsityscoregenerator.FindSparsityScores/CalculateSparsityScores',
                request_serializer=sparsityscoregenerator__pb2.SSGRequest.SerializeToString,
                response_deserializer=sparsityscoregenerator__pb2.SSGReply.FromString,
                )


class FindSparsityScoresServicer(object):
    """Missing associated documentation comment in .proto file."""

    def CheckServerConnection(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def CheckDatabaseConnection(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def CalculateSparsityScores(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_FindSparsityScoresServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'CheckServerConnection': grpc.unary_unary_rpc_method_handler(
                    servicer.CheckServerConnection,
                    request_deserializer=sparsityscoregenerator__pb2.ConnectionRequest.FromString,
                    response_serializer=sparsityscoregenerator__pb2.ConnectionReply.SerializeToString,
            ),
            'CheckDatabaseConnection': grpc.unary_unary_rpc_method_handler(
                    servicer.CheckDatabaseConnection,
                    request_deserializer=sparsityscoregenerator__pb2.ConnectionRequest.FromString,
                    response_serializer=sparsityscoregenerator__pb2.ConnectionReply.SerializeToString,
            ),
            'CalculateSparsityScores': grpc.unary_stream_rpc_method_handler(
                    servicer.CalculateSparsityScores,
                    request_deserializer=sparsityscoregenerator__pb2.SSGRequest.FromString,
                    response_serializer=sparsityscoregenerator__pb2.SSGReply.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'sparsityscoregenerator.FindSparsityScores', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class FindSparsityScores(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def CheckServerConnection(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/sparsityscoregenerator.FindSparsityScores/CheckServerConnection',
            sparsityscoregenerator__pb2.ConnectionRequest.SerializeToString,
            sparsityscoregenerator__pb2.ConnectionReply.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def CheckDatabaseConnection(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/sparsityscoregenerator.FindSparsityScores/CheckDatabaseConnection',
            sparsityscoregenerator__pb2.ConnectionRequest.SerializeToString,
            sparsityscoregenerator__pb2.ConnectionReply.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def CalculateSparsityScores(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_stream(request, target, '/sparsityscoregenerator.FindSparsityScores/CalculateSparsityScores',
            sparsityscoregenerator__pb2.SSGRequest.SerializeToString,
            sparsityscoregenerator__pb2.SSGReply.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
