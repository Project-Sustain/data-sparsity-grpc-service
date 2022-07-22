# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: sparsityscoregenerator.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x1csparsityscoregenerator.proto\x12\x16sparsityscoregenerator\"\x13\n\x11\x43onnectionRequest\"!\n\x0f\x43onnectionReply\x12\x0e\n\x06status\x18\x01 \x01(\x08\"\xfc\x01\n\nSSGRequest\x12\x16\n\x0e\x63ollectionName\x18\x01 \x01(\t\x12\x42\n\x0cspatialScope\x18\x02 \x01(\x0e\x32,.sparsityscoregenerator.SSGRequest.ScopeType\x12\x19\n\x11spatialIdentifier\x18\x03 \x01(\t\x12\x11\n\tstartTime\x18\x04 \x01(\x03\x12\x0f\n\x07\x65ndTime\x18\x05 \x01(\x03\x12\x18\n\x10measurementTypes\x18\x06 \x03(\t\"9\n\tScopeType\x12\x08\n\x04SITE\x10\x00\x12\n\n\x06\x43OUNTY\x10\x01\x12\t\n\x05STATE\x10\x02\x12\x0b\n\x07\x43OUNTRY\x10\x03\"\xdd\x01\n\x08SSGReply\x12\x11\n\tmonitorId\x18\x01 \x01(\t\x12\x15\n\rsparsityScore\x18\x02 \x01(\x01\x12\x41\n\x0b\x63oordinates\x18\x03 \x01(\x0b\x32,.sparsityscoregenerator.SSGReply.Coordinates\x12\x1c\n\x14numberOfMeasurements\x18\x04 \x01(\x05\x12\x12\n\nepochTimes\x18\x05 \x03(\x03\x1a\x32\n\x0b\x43oordinates\x12\x11\n\tlongitude\x18\x01 \x01(\x01\x12\x10\n\x08latitude\x18\x02 \x01(\x01\x32\xd9\x02\n\x12\x46indSparsityScores\x12m\n\x15\x43heckServerConnection\x12).sparsityscoregenerator.ConnectionRequest\x1a\'.sparsityscoregenerator.ConnectionReply\"\x00\x12o\n\x17\x43heckDatabaseConnection\x12).sparsityscoregenerator.ConnectionRequest\x1a\'.sparsityscoregenerator.ConnectionReply\"\x00\x12\x63\n\x17\x43\x61lculateSparsityScores\x12\".sparsityscoregenerator.SSGRequest\x1a .sparsityscoregenerator.SSGReply\"\x00\x30\x01\x42R\n+io.grpc.datasparsity.sparsityscoregeneratorB\x1bSparsityScoreGeneratorProtoP\x01\xa2\x02\x03SSGb\x06proto3')



_CONNECTIONREQUEST = DESCRIPTOR.message_types_by_name['ConnectionRequest']
_CONNECTIONREPLY = DESCRIPTOR.message_types_by_name['ConnectionReply']
_SSGREQUEST = DESCRIPTOR.message_types_by_name['SSGRequest']
_SSGREPLY = DESCRIPTOR.message_types_by_name['SSGReply']
_SSGREPLY_COORDINATES = _SSGREPLY.nested_types_by_name['Coordinates']
_SSGREQUEST_SCOPETYPE = _SSGREQUEST.enum_types_by_name['ScopeType']
ConnectionRequest = _reflection.GeneratedProtocolMessageType('ConnectionRequest', (_message.Message,), {
  'DESCRIPTOR' : _CONNECTIONREQUEST,
  '__module__' : 'sparsityscoregenerator_pb2'
  # @@protoc_insertion_point(class_scope:sparsityscoregenerator.ConnectionRequest)
  })
_sym_db.RegisterMessage(ConnectionRequest)

ConnectionReply = _reflection.GeneratedProtocolMessageType('ConnectionReply', (_message.Message,), {
  'DESCRIPTOR' : _CONNECTIONREPLY,
  '__module__' : 'sparsityscoregenerator_pb2'
  # @@protoc_insertion_point(class_scope:sparsityscoregenerator.ConnectionReply)
  })
_sym_db.RegisterMessage(ConnectionReply)

SSGRequest = _reflection.GeneratedProtocolMessageType('SSGRequest', (_message.Message,), {
  'DESCRIPTOR' : _SSGREQUEST,
  '__module__' : 'sparsityscoregenerator_pb2'
  # @@protoc_insertion_point(class_scope:sparsityscoregenerator.SSGRequest)
  })
_sym_db.RegisterMessage(SSGRequest)

SSGReply = _reflection.GeneratedProtocolMessageType('SSGReply', (_message.Message,), {

  'Coordinates' : _reflection.GeneratedProtocolMessageType('Coordinates', (_message.Message,), {
    'DESCRIPTOR' : _SSGREPLY_COORDINATES,
    '__module__' : 'sparsityscoregenerator_pb2'
    # @@protoc_insertion_point(class_scope:sparsityscoregenerator.SSGReply.Coordinates)
    })
  ,
  'DESCRIPTOR' : _SSGREPLY,
  '__module__' : 'sparsityscoregenerator_pb2'
  # @@protoc_insertion_point(class_scope:sparsityscoregenerator.SSGReply)
  })
_sym_db.RegisterMessage(SSGReply)
_sym_db.RegisterMessage(SSGReply.Coordinates)

_FINDSPARSITYSCORES = DESCRIPTOR.services_by_name['FindSparsityScores']
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  DESCRIPTOR._serialized_options = b'\n+io.grpc.datasparsity.sparsityscoregeneratorB\033SparsityScoreGeneratorProtoP\001\242\002\003SSG'
  _CONNECTIONREQUEST._serialized_start=56
  _CONNECTIONREQUEST._serialized_end=75
  _CONNECTIONREPLY._serialized_start=77
  _CONNECTIONREPLY._serialized_end=110
  _SSGREQUEST._serialized_start=113
  _SSGREQUEST._serialized_end=365
  _SSGREQUEST_SCOPETYPE._serialized_start=308
  _SSGREQUEST_SCOPETYPE._serialized_end=365
  _SSGREPLY._serialized_start=368
  _SSGREPLY._serialized_end=589
  _SSGREPLY_COORDINATES._serialized_start=539
  _SSGREPLY_COORDINATES._serialized_end=589
  _FINDSPARSITYSCORES._serialized_start=592
  _FINDSPARSITYSCORES._serialized_end=937
# @@protoc_insertion_point(module_scope)
